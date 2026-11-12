'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { ApiError } from '../../../shared/api/api-client';
import {
  PROMO_BANNER_ASPECT_RATIO_LABELS,
  PROMO_BANNER_FREQUENCY_LABELS,
  PROMO_BANNER_TYPE_LABELS,
  normalizePromoBannerAspectRatio,
  type PromoBanner,
  type PromoBannerAspectRatio,
  type PromoBannerDisplayFrequency,
  type PromoBannerType,
} from '../../../shared/types/promo-banner';
import { useAuthStore } from '../../../store/auth.store';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import { PromoBannerAspectMedia } from '@/features/restaurants/components/PromoBannerAspectMedia';
import {
  createPromoBanner,
  deletePromoBanner,
  fetchPromoBanners,
  updatePromoBanner,
  uploadPromoBannerImage,
} from '../api/promo-banners.api';
import { PromoBannerImageCropper } from '../components/PromoBannerImageCropper';
import {
  exportCroppedImageFile,
  type CropTransform,
} from '../utils/promo-banner-crop.util';
import {
  DRAFT_ORIGINAL_KEY,
  loadPromoBannerOriginal,
  savePromoBannerOriginal,
} from '../utils/promo-banner-original.storage';
import '../styles/promo-banners-admin.scss';

interface BannerFormState {
  type: PromoBannerType;
  title: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: string;
  displayFrequency: PromoBannerDisplayFrequency;
  aspectRatio: PromoBannerAspectRatio;
  imageUrl: string;
  imageWebpUrl: string | null;
}

interface CropSessionState {
  objectUrl: string;
  fileName: string;
  originalFile: File;
}

const EMPTY_FORM: BannerFormState = {
  type: 'strip',
  title: '',
  linkUrl: '',
  isActive: true,
  sortOrder: '0',
  displayFrequency: 'every_visit',
  aspectRatio: '4_1',
  imageUrl: '',
  imageWebpUrl: null,
};

export default function PromoBannersAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [form, setForm] = useState<BannerFormState>(EMPTY_FORM);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropSession, setCropSession] = useState<CropSessionState | null>(null);
  const [storedOriginalAvailable, setStoredOriginalAvailable] = useState(false);
  const pendingOriginalRef = useRef<File | null>(null);

  const revokeCropObjectUrl = useCallback((session: CropSessionState | null) => {
    if (session?.objectUrl) {
      URL.revokeObjectURL(session.objectUrl);
    }
  }, []);

  const loadBanners = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchPromoBanners(restaurantId);
      setBanners(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить баннеры');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void loadBanners();
  }, [loadBanners]);

  useEffect(() => {
    return () => {
      revokeCropObjectUrl(cropSession);
    };
  }, [cropSession, revokeCropObjectUrl]);

  function clearCropSession() {
    setCropSession((prev) => {
      revokeCropObjectUrl(prev);
      return null;
    });
  }

  function resetForm() {
    clearCropSession();
    pendingOriginalRef.current = null;
    setStoredOriginalAvailable(false);
    setForm(EMPTY_FORM);
    setEditingBanner(null);
    setError(null);
  }

  async function refreshStoredOriginalAvailability(bannerId: string) {
    if (!restaurantId) {
      setStoredOriginalAvailable(false);
      return;
    }
    const blob = await loadPromoBannerOriginal(restaurantId, bannerId);
    setStoredOriginalAvailable(Boolean(blob));
  }

  function handleEdit(banner: PromoBanner) {
    clearCropSession();
    pendingOriginalRef.current = null;
    setEditingBanner(banner);
    setForm({
      type: banner.type,
      title: banner.title ?? '',
      linkUrl: banner.linkUrl ?? '',
      isActive: banner.isActive,
      sortOrder: String(banner.sortOrder),
      displayFrequency: banner.displayFrequency,
      aspectRatio: normalizePromoBannerAspectRatio(banner.aspectRatio),
      imageUrl: banner.imageUrl,
      imageWebpUrl: banner.imageWebpUrl,
    });
    setError(null);
    void refreshStoredOriginalAvailability(banner.id);
  }

  function openCropSession(file: File) {
    clearCropSession();
    const objectUrl = URL.createObjectURL(file);
    setCropSession({
      objectUrl,
      fileName: file.name,
      originalFile: file,
    });
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    pendingOriginalRef.current = file;
    openCropSession(file);
  }

  async function handleRecropFromStoredOriginal() {
    if (!restaurantId || !editingBanner) {
      return;
    }
    const blob = await loadPromoBannerOriginal(restaurantId, editingBanner.id);
    if (!blob) {
      setStoredOriginalAvailable(false);
      setError('Исходное изображение недоступно — загрузите файл заново.');
      return;
    }
    const file = new File([blob], `${editingBanner.id}-original`, {
      type: blob.type || 'image/jpeg',
    });
    pendingOriginalRef.current = file;
    openCropSession(file);
  }

  async function handleCropConfirm(
    transform: CropTransform,
    viewport: { width: number; height: number },
  ) {
    if (!cropSession || !restaurantId || !accessToken) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const croppedFile = await exportCroppedImageFile(
        cropSession.objectUrl,
        viewport,
        transform,
        cropSession.fileName,
      );
      const uploaded = await uploadPromoBannerImage(restaurantId, accessToken, croppedFile);
      pendingOriginalRef.current = cropSession.originalFile;
      const originalKey = editingBanner?.id ?? DRAFT_ORIGINAL_KEY;
      await savePromoBannerOriginal(restaurantId, originalKey, cropSession.originalFile);
      if (editingBanner) {
        setStoredOriginalAvailable(true);
      }
      setForm((prev) => ({
        ...prev,
        imageUrl: uploaded.imageUrl,
        imageWebpUrl: uploaded.imageWebpUrl,
      }));
      clearCropSession();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить изображение');
    } finally {
      setUploading(false);
    }
  }

  async function persistOriginalForBanner(bannerId: string) {
    if (!restaurantId || !pendingOriginalRef.current) {
      return;
    }
    await savePromoBannerOriginal(restaurantId, bannerId, pendingOriginalRef.current);
    if (editingBanner?.id === bannerId) {
      setStoredOriginalAvailable(true);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!restaurantId || !accessToken) {
      return;
    }

    if (cropSession) {
      setError('Сначала примените обрезку или отмените её.');
      return;
    }

    if (!form.imageUrl) {
      setError('Загрузите изображение баннера');
      return;
    }

    const sortOrder = Number.parseInt(form.sortOrder, 10);
    if (Number.isNaN(sortOrder) || sortOrder < 0) {
      setError('Порядок должен быть целым числом ≥ 0');
      return;
    }

    const trimmedLink = form.linkUrl.trim();
    const payload = {
      type: form.type,
      title: form.title.trim() || null,
      imageUrl: form.imageUrl,
      imageWebpUrl: form.imageWebpUrl,
      linkUrl: trimmedLink || null,
      isActive: form.isActive,
      sortOrder,
      ...(form.type === 'modal' ? { displayFrequency: form.displayFrequency } : {}),
      ...(form.type === 'strip' ? { aspectRatio: form.aspectRatio } : {}),
    };

    setSaving(true);
    setError(null);

    try {
      if (editingBanner) {
        await updatePromoBanner(restaurantId, accessToken, editingBanner.id, payload);
        await persistOriginalForBanner(editingBanner.id);
      } else {
        const created = await createPromoBanner(restaurantId, accessToken, {
          ...payload,
          title: payload.title ?? undefined,
        });
        const draftOriginal = await loadPromoBannerOriginal(restaurantId, DRAFT_ORIGINAL_KEY);
        const original = pendingOriginalRef.current ?? draftOriginal;
        if (original) {
          await savePromoBannerOriginal(restaurantId, created.id, original);
        }
      }

      resetForm();
      await loadBanners();
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : editingBanner
            ? 'Не удалось сохранить баннер'
            : 'Не удалось создать баннер',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(bannerId: string) {
    if (!restaurantId || !accessToken) {
      return;
    }
    if (!window.confirm('Удалить баннер?')) {
      return;
    }

    setError(null);

    try {
      await deletePromoBanner(restaurantId, accessToken, bannerId);
      if (editingBanner?.id === bannerId) {
        resetForm();
      }
      await loadBanners();
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось удалить баннер');
    }
  }

  const cropLockAspect =
    form.type === 'strip' ? form.aspectRatio : ('modal' as const);

  const previewBanner: PromoBanner | null = form.imageUrl
    ? {
        id: 'preview',
        restaurantId: restaurantId ?? '',
        type: form.type,
        title: form.title || null,
        imageUrl: form.imageUrl,
        imageWebpUrl: form.imageWebpUrl,
        linkUrl: form.linkUrl || null,
        isActive: true,
        sortOrder: 0,
        displayFrequency: form.displayFrequency,
        aspectRatio: form.aspectRatio,
        createdAt: '',
        updatedAt: '',
      }
    : null;

  if (!restaurantId) {
    return (
      <p className="promo-banners-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  return (
    <div className="promo-banners-admin" data-testid="promo-banners-admin">
      <section className="promo-banners-admin__panel">
        <h2>{editingBanner ? 'Редактирование баннера' : 'Новый баннер'}</h2>
        <p className="promo-banners-admin__hint">
          Можно разместить плашку под шапкой и/или модальное окно с акцией — оба вида могут
          работать одновременно. Для модалки выберите: показывать один раз или при каждом
          заходе.
        </p>

        {error && <p className="promo-banners-admin__error">{error}</p>}

        <form className="promo-banners-admin__form" onSubmit={(e) => void handleSubmit(e)}>
          <div className="promo-banners-admin__field">
            <span className="promo-banners-admin__label">Тип *</span>
            <div className="promo-banners-admin__radios">
              {(['strip', 'modal'] as const).map((type) => (
                <label key={type} className="promo-banners-admin__radio">
                  <input
                    type="radio"
                    name="banner-type"
                    value={type}
                    checked={form.type === type}
                    onChange={() => setForm((prev) => ({ ...prev, type }))}
                  />
                  {PROMO_BANNER_TYPE_LABELS[type]}
                </label>
              ))}
            </div>
          </div>

          {form.type === 'modal' && (
            <div className="promo-banners-admin__field">
              <span className="promo-banners-admin__label">Показ модалки *</span>
              <div className="promo-banners-admin__radios">
                {(['once', 'every_visit'] as const).map((freq) => (
                  <label key={freq} className="promo-banners-admin__radio">
                    <input
                      type="radio"
                      name="banner-freq"
                      value={freq}
                      checked={form.displayFrequency === freq}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, displayFrequency: freq }))
                      }
                    />
                    {PROMO_BANNER_FREQUENCY_LABELS[freq]}
                  </label>
                ))}
              </div>
            </div>
          )}

          {form.type === 'strip' && (
            <div className="promo-banners-admin__field">
              <span className="promo-banners-admin__label">Формат *</span>
              <div className="promo-banners-admin__radios promo-banners-admin__radios--stack">
                {(['4_1', '16_9'] as const).map((ratio) => (
                  <label key={ratio} className="promo-banners-admin__radio">
                    <input
                      type="radio"
                      name="banner-aspect"
                      value={ratio}
                      checked={form.aspectRatio === ratio}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, aspectRatio: ratio }))
                      }
                    />
                    {PROMO_BANNER_ASPECT_RATIO_LABELS[ratio]}
                  </label>
                ))}
              </div>
              <p className="promo-banners-admin__file-hint">
                16∶9 — тот же формат, что на телевизорах в зале; можно загрузить тот же файл.
              </p>
            </div>
          )}

          <div className="promo-banners-admin__field">
            <label htmlFor="promo-banner-title">Заголовок</label>
            <input
              id="promo-banner-title"
              type="text"
              maxLength={200}
              placeholder="Например: −20% на десерты"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="promo-banners-admin__field">
            <label htmlFor="promo-banner-link">Ссылка по клику</label>
            <input
              id="promo-banner-link"
              type="url"
              inputMode="url"
              placeholder="https://… (необязательно)"
              value={form.linkUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, linkUrl: e.target.value }))}
            />
          </div>

          <div className="promo-banners-admin__row">
            <div className="promo-banners-admin__field">
              <label htmlFor="promo-banner-order">Порядок</label>
              <input
                id="promo-banner-order"
                type="number"
                min={0}
                step={1}
                value={form.sortOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
              />
            </div>

            <label className="promo-banners-admin__checkbox">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              Активен
            </label>
          </div>

          <div className="promo-banners-admin__field">
            <label htmlFor="promo-banner-file">Изображение *</label>
            <input
              id="promo-banner-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading || saving}
              data-testid="promo-banner-file-input"
              onChange={handleImageChange}
            />
            <p className="promo-banners-admin__file-hint">
              JPG, PNG или WebP, до 5 МБ. После выбора файла откроется обрезка под выбранный
              формат.
            </p>
            {editingBanner && (
              <p
                className="promo-banners-admin__file-hint"
                data-testid="promo-banner-recrop-hint"
              >
                {storedOriginalAvailable
                  ? 'Исходник сохранён в этом браузере — можно перекадрировать без повторной загрузки.'
                  : 'Исходник недоступен (другой браузер или баннер создан до обрезки) — для новой обрезки загрузите файл заново.'}
              </p>
            )}
            {editingBanner && storedOriginalAvailable && !cropSession && (
              <button
                type="button"
                className="promo-banners-admin__recrop"
                data-testid="promo-banner-recrop-button"
                disabled={uploading || saving}
                onClick={() => void handleRecropFromStoredOriginal()}
              >
                Перекадрировать
              </button>
            )}
          </div>

          {cropSession && (
            <PromoBannerImageCropper
              key={`${cropLockAspect}-${cropSession.objectUrl}`}
              imageUrl={cropSession.objectUrl}
              sourceFileName={cropSession.fileName}
              lockedAspectRatio={cropLockAspect}
              confirming={uploading}
              onCancel={clearCropSession}
              onConfirm={(transform, viewport) => void handleCropConfirm(transform, viewport)}
            />
          )}

          {previewBanner && !cropSession && (
            <div className="promo-banners-admin__preview" data-testid="promo-banner-admin-preview">
              <span className="promo-banners-admin__preview-label">Превью на странице</span>
              <PromoBannerAspectMedia
                banner={previewBanner}
                aspectRatioOverride={
                  previewBanner.type === 'strip' ? form.aspectRatio : undefined
                }
                frameTestId="promo-banner-admin-preview-frame"
              />
            </div>
          )}

          <div className="promo-banners-admin__actions">
            <button
              className="promo-banners-admin__submit"
              type="submit"
              data-testid="promo-banner-submit"
              disabled={saving || uploading || !form.imageUrl || Boolean(cropSession)}
            >
              {saving ? 'Сохранение…' : editingBanner ? 'Сохранить' : 'Добавить'}
            </button>
            {editingBanner && (
              <button
                className="promo-banners-admin__cancel"
                type="button"
                disabled={saving}
                onClick={resetForm}
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="promo-banners-admin__list-panel">
        <h2>Ваши баннеры</h2>

        {loading ? (
          <p className="promo-banners-admin__empty">Загрузка…</p>
        ) : banners.length === 0 ? (
          <p className="promo-banners-admin__empty">Пока нет баннеров.</p>
        ) : (
          <ul className="promo-banners-admin__list">
            {banners.map((banner) => (
              <li
                key={banner.id}
                className={`promo-banners-admin__item${
                  editingBanner?.id === banner.id ? ' promo-banners-admin__item--editing' : ''
                }${!banner.isActive ? ' promo-banners-admin__item--inactive' : ''}`}
              >
                <div
                  className={`promo-banners-admin__thumb-wrap${
                    banner.type === 'strip'
                      ? banner.aspectRatio === '16_9'
                        ? ' promo-banners-admin__thumb-wrap--16-9'
                        : ' promo-banners-admin__thumb-wrap--4-1'
                      : ''
                  }`}
                >
                  <PromoBannerAspectMedia
                    banner={banner}
                    frameClassName="promo-banners-admin__thumb-frame"
                    imageClassName="promo-banners-admin__thumb"
                  />
                </div>
                <div className="promo-banners-admin__item-body">
                  <strong>{banner.title?.trim() || 'Без заголовка'}</strong>
                  <span>
                    {PROMO_BANNER_TYPE_LABELS[banner.type]}
                    {banner.type === 'modal'
                      ? ` · ${PROMO_BANNER_FREQUENCY_LABELS[banner.displayFrequency]}`
                      : ''}
                    {banner.type === 'strip'
                      ? ` · ${normalizePromoBannerAspectRatio(banner.aspectRatio) === '16_9' ? '16∶9' : '4∶1'}`
                      : ''}
                    {!banner.isActive ? ' · выключен' : ''}
                  </span>
                </div>
                <div className="promo-banners-admin__item-actions">
                  <button type="button" onClick={() => handleEdit(banner)}>
                    Изменить
                  </button>
                  <button
                    type="button"
                    className="promo-banners-admin__delete"
                    onClick={() => void handleDelete(banner.id)}
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
