import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import type {
  MenuCategory,
  MenuItem,
  MenuModifierGroup,
  MenuItemNutrition,
} from '../../../shared/types/menu';
import { MAX_MENU_ITEM_GALLERY_IMAGES, resolveImageUrl } from '../../../shared/types/menu';
import { CurrencySign } from '../../../shared/components/CurrencySign';
import {
  createMenuItem,
  updateMenuItem,
  uploadMenuImage,
} from '../api/menu.api';
import { ModifierGroupsEditor } from './ModifierGroupsEditor';
import '../styles/menu-item-form.scss';

interface MenuItemFormProps {
  restaurantId: string;
  token: string;
  categories: MenuCategory[];
  onCategoryCreate: (name: string) => Promise<string>;
  onSuccess: () => void;
  editingItem?: MenuItem | null;
  onCancelEdit?: () => void;
}

const emptyNutrition = (): MenuItemNutrition => ({});

function handleEnterNavigation(event: KeyboardEvent<HTMLFormElement>) {
  if (event.key !== 'Enter') {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.tagName === 'TEXTAREA') {
    return;
  }

  if (target.tagName === 'BUTTON' || target.closest('button')) {
    return;
  }

  if (target instanceof HTMLInputElement) {
    if (target.type === 'file' || target.type === 'checkbox' || target.type === 'submit') {
      return;
    }
  }

  event.preventDefault();

  const form = event.currentTarget;
  const focusable = Array.from(
    form.querySelectorAll<HTMLElement>(
      'input:not([type="file"]):not([type="checkbox"]):not([type="hidden"]), select, textarea',
    ),
  ).filter((element) => !element.hasAttribute('disabled'));

  const index = focusable.indexOf(target);
  if (index >= 0 && index < focusable.length - 1) {
    focusable[index + 1].focus();
    return;
  }

  if (index === focusable.length - 1) {
    form.querySelector<HTMLButtonElement>('.menu-item-form__submit')?.focus();
  }
}

export function MenuItemForm({
  restaurantId,
  token,
  categories,
  onCategoryCreate,
  onSuccess,
  editingItem,
  onCancelEdit,
}: MenuItemFormProps) {
  const isEditing = Boolean(editingItem);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [name, setName] = useState('');
  const [variantLabel, setVariantLabel] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [price, setPrice] = useState('');
  const [nutrition, setNutrition] = useState<MenuItemNutrition>(emptyNutrition());
  const [modifierGroups, setModifierGroups] = useState<MenuModifierGroup[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setCategoryId(categories[0]?.id ?? '');
    setNewCategoryName('');
    setName('');
    setVariantLabel('');
    setDescription('');
    setIngredients('');
    setPrice('');
    setNutrition(emptyNutrition());
    setModifierGroups([]);
    setImageUrl('');
    setImagePreview('');
    setGalleryUrls([]);
    setError(null);
  }

  useEffect(() => {
    if (!editingItem) {
      return;
    }

    setCategoryId(editingItem.categoryId);
    setName(editingItem.name);
    setVariantLabel(editingItem.variantLabel ?? '');
    setDescription(editingItem.description ?? '');
    setIngredients(editingItem.ingredients ?? '');
    setPrice(String(editingItem.price));
    setNutrition(editingItem.nutrition ?? emptyNutrition());
    setModifierGroups(editingItem.modifierGroups ?? []);
    setImageUrl(editingItem.imageUrl);
    setImagePreview('');
    setGalleryUrls(editingItem.galleryUrls ?? []);
    setError(null);
  }, [editingItem]);

  useEffect(() => {
    if (!isEditing && !categoryId && categories[0]?.id) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId, isEditing]);

  async function handleImageChange(file: File | undefined) {
    if (!file) return;

    setError(null);
    setUploading(true);
    setImagePreview(URL.createObjectURL(file));

    try {
      const result = await uploadMenuImage(restaurantId, token, file);
      setImageUrl(result.imageUrl);
    } catch (err) {
      setImagePreview('');
      setImageUrl('');
      setError(err instanceof Error ? err.message : 'Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryChange(files: FileList | null) {
    if (!files || files.length === 0) return;

    const remaining = MAX_MENU_ITEM_GALLERY_IMAGES - galleryUrls.length;
    if (remaining <= 0) {
      setError(`Максимум ${MAX_MENU_ITEM_GALLERY_IMAGES} дополнительных фото`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    setError(null);
    setGalleryUploading(true);

    try {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        const result = await uploadMenuImage(restaurantId, token, file);
        uploaded.push(result.imageUrl);
      }
      setGalleryUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить фото галереи');
    } finally {
      setGalleryUploading(false);
    }
  }

  function handleRemoveGalleryImage(index: number) {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  }

  // Продвигает фото из галереи в обложку: старая обложка уходит в галерею на его место.
  function handleMakeCover(index: number) {
    if (!imageUrl) return;
    const newCover = galleryUrls[index];
    if (!newCover) return;
    setGalleryUrls((prev) => {
      const next = [...prev];
      next[index] = imageUrl;
      return next;
    });
    setImageUrl(newCover);
    setImagePreview('');
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    const newId = await onCategoryCreate(newCategoryName.trim());
    setCategoryId(newId);
    setNewCategoryName('');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!imageUrl) {
      setError('Загрузите фотографию блюда');
      return;
    }

    if (!categoryId) {
      setError('Выберите или создайте категорию');
      return;
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Укажите корректную базовую цену');
      return;
    }

    for (const group of modifierGroups) {
      if (!group.name.trim()) {
        setError('У каждой группы модификаторов должно быть название');
        return;
      }
      if (group.options.some((option) => !option.name.trim())) {
        setError(`Заполните все варианты в группе «${group.name}»`);
        return;
      }
    }

    setLoading(true);

    const nutritionPayload =
      nutrition.calories || nutrition.protein || nutrition.fat || nutrition.carbs
        ? nutrition
        : undefined;

    const trimmedVariantLabel = variantLabel.trim();

    const payload = {
      categoryId,
      name: name.trim(),
      variantLabel: trimmedVariantLabel || undefined,
      description: description.trim() || undefined,
      ingredients: ingredients.trim() || undefined,
      nutrition: nutritionPayload,
      price: parsedPrice,
      imageUrl,
      galleryUrls,
      modifierGroups: modifierGroups.length ? modifierGroups : undefined,
    };

    try {
      if (isEditing && editingItem) {
        await updateMenuItem(restaurantId, token, editingItem.id, {
          ...payload,
          variantLabel: trimmedVariantLabel || null,
        });
        resetForm();
        onCancelEdit?.();
      } else {
        await createMenuItem(restaurantId, token, payload);
        resetForm();
      }

      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : isEditing
            ? 'Не удалось сохранить изменения'
            : 'Не удалось создать позицию',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    resetForm();
    onCancelEdit?.();
  }

  return (
    <form className="menu-item-form" onSubmit={handleSubmit} onKeyDown={handleEnterNavigation}>
      <h2>{isEditing ? 'Редактирование позиции' : 'Новая позиция меню'}</h2>
      {error && <p className="menu-item-form__error">{error}</p>}

      <div className="menu-item-form__field">
        <label>Фотография (обложка) *</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => void handleImageChange(e.target.files?.[0])}
        />
        {uploading && <p className="menu-item-form__hint">Загрузка…</p>}
        {(imagePreview || imageUrl) && (
          <img
            className="menu-item-form__preview menu-item-form__preview--cover"
            src={imagePreview || resolveImageUrl(imageUrl)}
            alt="Превью обложки"
          />
        )}
        <p className="menu-item-form__hint">
          Обложка отображается в карточке товара в меню.
        </p>
      </div>

      <div className="menu-item-form__field">
        <label>
          Дополнительные фото (до {MAX_MENU_ITEM_GALLERY_IMAGES})
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={galleryUrls.length >= MAX_MENU_ITEM_GALLERY_IMAGES || galleryUploading}
          onChange={(e) => void handleGalleryChange(e.target.files)}
        />
        {galleryUploading && <p className="menu-item-form__hint">Загрузка галереи…</p>}
        {galleryUrls.length > 0 && (
          <div className="menu-item-form__gallery">
            {galleryUrls.map((url, index) => (
              <div className="menu-item-form__gallery-item" key={`${url}-${index}`}>
                <img src={resolveImageUrl(url)} alt={`Доп. фото ${index + 1}`} />
                <div className="menu-item-form__gallery-actions">
                  <button
                    type="button"
                    className="menu-item-form__gallery-btn"
                    onClick={() => handleMakeCover(index)}
                    title="Сделать обложкой"
                  >
                    Обложка
                  </button>
                  <button
                    type="button"
                    className="menu-item-form__gallery-btn menu-item-form__gallery-btn--danger"
                    onClick={() => handleRemoveGalleryImage(index)}
                    title="Удалить"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="menu-item-form__hint">
          Видны только в окне товара. Кнопкой «Обложка» можно выбрать, какое фото
          показывать первым в меню.
        </p>
      </div>

      <div className="menu-item-form__row">
        <div className="menu-item-form__field">
          <label htmlFor="item-category">Категория *</label>
          <select
            id="item-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>
              Выберите категорию
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="menu-item-form__field menu-item-form__field--inline">
          <label htmlFor="new-category">Новая категория</label>
          <div className="menu-item-form__inline">
            <input
              id="new-category"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Напитки"
            />
            <button type="button" onClick={() => void handleCreateCategory()}>
              +
            </button>
          </div>
        </div>
      </div>

      <div className="menu-item-form__field">
        <label htmlFor="item-name">Название *</label>
        <input id="item-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="menu-item-form__field">
        <label htmlFor="item-variant-label">Уточнение к названию</label>
        <input
          id="item-variant-label"
          maxLength={80}
          value={variantLabel}
          onChange={(e) => setVariantLabel(e.target.value)}
          placeholder="325 г, 650 мл, 11 шт."
        />
        <p className="menu-item-form__hint">
          Необязательно — объём, вес или количество: «650 мл», «11 роз» и т.п.
        </p>
      </div>

      <div className="menu-item-form__field">
        <label htmlFor="item-price">
          Базовая цена (
          <CurrencySign />
          ) *
        </label>
        <input
          id="item-price"
          type="number"
          min="0"
          step="0.01"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="menu-item-form__field">
        <label htmlFor="item-description">Описание</label>
        <textarea
          id="item-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="menu-item-form__field">
        <label htmlFor="item-ingredients">Ингредиенты</label>
        <textarea
          id="item-ingredients"
          rows={2}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Молоко, тапиока, чай..."
        />
      </div>

      <fieldset className="menu-item-form__fieldset menu-item-form__nutrition-block">
        <legend>КБЖУ</legend>
        <p className="menu-item-form__nutrition-note">Необязательно — укажите на 100 г или на порцию</p>
        <div className="menu-item-form__nutrition">
          <label className="nutrition-card nutrition-card--calories">
            <span className="nutrition-card__label">Ккал</span>
            <span className="nutrition-card__input-wrap">
              <input
                type="number"
                min="0"
                step="0.1"
                inputMode="decimal"
                placeholder="0"
                value={nutrition.calories ?? ''}
                onChange={(e) =>
                  setNutrition((n) => ({
                    ...n,
                    calories: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
              <span className="nutrition-card__unit">ккал</span>
            </span>
          </label>

          <label className="nutrition-card nutrition-card--protein">
            <span className="nutrition-card__label">Белки</span>
            <span className="nutrition-card__input-wrap">
              <input
                type="number"
                min="0"
                step="0.1"
                inputMode="decimal"
                placeholder="0"
                value={nutrition.protein ?? ''}
                onChange={(e) =>
                  setNutrition((n) => ({
                    ...n,
                    protein: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
              <span className="nutrition-card__unit">г</span>
            </span>
          </label>

          <label className="nutrition-card nutrition-card--fat">
            <span className="nutrition-card__label">Жиры</span>
            <span className="nutrition-card__input-wrap">
              <input
                type="number"
                min="0"
                step="0.1"
                inputMode="decimal"
                placeholder="0"
                value={nutrition.fat ?? ''}
                onChange={(e) =>
                  setNutrition((n) => ({
                    ...n,
                    fat: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
              <span className="nutrition-card__unit">г</span>
            </span>
          </label>

          <label className="nutrition-card nutrition-card--carbs">
            <span className="nutrition-card__label">Углеводы</span>
            <span className="nutrition-card__input-wrap">
              <input
                type="number"
                min="0"
                step="0.1"
                inputMode="decimal"
                placeholder="0"
                value={nutrition.carbs ?? ''}
                onChange={(e) =>
                  setNutrition((n) => ({
                    ...n,
                    carbs: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
              <span className="nutrition-card__unit">г</span>
            </span>
          </label>
        </div>
      </fieldset>

      <ModifierGroupsEditor groups={modifierGroups} onChange={setModifierGroups} />

      <div className="menu-item-form__actions">
        <button className="menu-item-form__submit" type="submit" disabled={loading || uploading || galleryUploading}>
          {loading
            ? 'Сохранение…'
            : isEditing
              ? 'Сохранить изменения'
              : 'Добавить в меню'}
        </button>
        {isEditing && (
          <button
            className="menu-item-form__cancel"
            type="button"
            disabled={loading || uploading || galleryUploading}
            onClick={handleCancelEdit}
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
