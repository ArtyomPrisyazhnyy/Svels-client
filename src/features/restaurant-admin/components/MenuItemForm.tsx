import { useState, type FormEvent } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import type { MenuCategory, MenuModifierGroup, MenuItemNutrition } from '../../../shared/types/menu';
import { resolveImageUrl } from '../../../shared/types/menu';
import {
  createMenuItem,
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
}

const emptyNutrition = (): MenuItemNutrition => ({});

export function MenuItemForm({
  restaurantId,
  token,
  categories,
  onCategoryCreate,
  onSuccess,
}: MenuItemFormProps) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [price, setPrice] = useState('');
  const [nutrition, setNutrition] = useState<MenuItemNutrition>(emptyNutrition());
  const [modifierGroups, setModifierGroups] = useState<MenuModifierGroup[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      const nutritionPayload =
        nutrition.calories || nutrition.protein || nutrition.fat || nutrition.carbs
          ? nutrition
          : undefined;

      await createMenuItem(restaurantId, token, {
        categoryId,
        name: name.trim(),
        description: description.trim() || undefined,
        ingredients: ingredients.trim() || undefined,
        nutrition: nutritionPayload,
        price: parsedPrice,
        imageUrl,
        modifierGroups: modifierGroups.length ? modifierGroups : undefined,
      });

      setName('');
      setDescription('');
      setIngredients('');
      setPrice('');
      setNutrition(emptyNutrition());
      setModifierGroups([]);
      setImageUrl('');
      setImagePreview('');
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось создать позицию');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="menu-item-form" onSubmit={handleSubmit}>
      <h2>Новая позиция меню</h2>
      {error && <p className="menu-item-form__error">{error}</p>}

      <div className="menu-item-form__field">
        <label>Фотография *</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => void handleImageChange(e.target.files?.[0])}
        />
        {uploading && <p className="menu-item-form__hint">Загрузка…</p>}
        {(imagePreview || imageUrl) && (
          <img
            className="menu-item-form__preview"
            src={imagePreview || resolveImageUrl(imageUrl)}
            alt="Превью"
          />
        )}
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
        <label htmlFor="item-price">Базовая цена (₽) *</label>
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
                inputMode="numeric"
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

      <button className="menu-item-form__submit" type="submit" disabled={loading || uploading}>
        {loading ? 'Сохранение…' : 'Добавить в меню'}
      </button>
    </form>
  );
}
