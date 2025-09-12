import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MenuItem, Category } from "@/hooks/useDatabase";

interface MenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem?: MenuItem | null;
  categories: Category[];
  onSave: (itemData: any) => Promise<void>;
  loading?: boolean;
}

const MenuItemDialog = ({ isOpen, onOpenChange, menuItem, categories, onSave, loading }: MenuItemDialogProps) => {
  const [formData, setFormData] = useState({
    category_id: '',
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: 0,
    discount_price: 0,
    image_url: '',
    rating: 4.5,
    prep_time: '15-20',
    is_spicy: false,
    is_offer: false,
    is_available: true,
    allow_customization: false,
    is_featured: false,
    sort_order: 0,
  });

  useEffect(() => {
    if (menuItem) {
      setFormData({
        category_id: menuItem.category_id || '',
        name_ar: menuItem.name_ar || '',
        name_en: menuItem.name_en || '',
        description_ar: menuItem.description_ar || '',
        description_en: menuItem.description_en || '',
        price: menuItem.price || 0,
        discount_price: menuItem.discount_price || 0,
        image_url: menuItem.image_url || '',
        rating: menuItem.rating || 4.5,
        prep_time: menuItem.prep_time || '15-20',
        is_spicy: menuItem.is_spicy || false,
        is_offer: menuItem.is_offer || false,
        is_available: menuItem.is_available ?? true,
        allow_customization: menuItem.allow_customization || false,
        is_featured: menuItem.is_featured || false,
        sort_order: menuItem.sort_order || 0,
      });
    } else {
      setFormData({
        category_id: '',
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        price: 0,
        discount_price: 0,
        image_url: '',
        rating: 4.5,
        prep_time: '15-20',
        is_spicy: false,
        is_offer: false,
        is_available: true,
        allow_customization: false,
        is_featured: false,
        sort_order: 0,
      });
    }
  }, [menuItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        discount_price: formData.discount_price || null,
      };
      await onSave(submitData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {menuItem ? 'تعديل الصنف' : 'إضافة صنف جديد'}
          </DialogTitle>
          <DialogDescription>
            {menuItem ? 'تعديل بيانات الصنف' : 'إضافة صنف جديد للقائمة'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_id">التصنيف</Label>
            <Select value={formData.category_id} onValueChange={(value) => handleChange('category_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_ar">الاسم بالعربية</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => handleChange('name_ar', e.target.value)}
                required
                className="font-arabic"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_en">الاسم بالإنجليزية</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => handleChange('name_en', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description_ar">الوصف بالعربية</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => handleChange('description_ar', e.target.value)}
                className="font-arabic"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => handleChange('description_en', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">السعر (جنيه)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount_price">سعر الخصم (اختياري)</Label>
              <Input
                id="discount_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.discount_price}
                onChange={(e) => handleChange('discount_price', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">رابط الصورة</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">التقييم</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 4.5)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prep_time">وقت التحضير</Label>
              <Input
                id="prep_time"
                value={formData.prep_time}
                onChange={(e) => handleChange('prep_time', e.target.value)}
                placeholder="15-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">ترتيب العرض</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_spicy"
                  checked={formData.is_spicy}
                  onCheckedChange={(checked) => handleChange('is_spicy', checked)}
                />
                <Label htmlFor="is_spicy">صنف حار</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_offer"
                  checked={formData.is_offer}
                  onCheckedChange={(checked) => handleChange('is_offer', checked)}
                />
                <Label htmlFor="is_offer">عرض خاص</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => handleChange('is_available', checked)}
                />
                <Label htmlFor="is_available">متاح</Label>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="allow_customization"
                  checked={formData.allow_customization}
                  onCheckedChange={(checked) => handleChange('allow_customization', checked)}
                />
                <Label htmlFor="allow_customization">يمكن تخصيصه</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured">منتج مميز</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : (menuItem ? 'تحديث' : 'إضافة')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDialog;