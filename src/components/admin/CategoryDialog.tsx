import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/hooks/useDatabase";

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSave: (categoryData: any) => Promise<void>;
  loading?: boolean;
}

const CategoryDialog = ({ isOpen, onOpenChange, category, onSave, loading }: CategoryDialogProps) => {
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    image_url: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name_ar: category.name_ar || '',
        name_en: category.name_en || '',
        description_ar: category.description_ar || '',
        description_en: category.description_en || '',
        image_url: category.image_url || '',
        sort_order: category.sort_order || 0,
        is_active: category.is_active,
      });
    } else {
      setFormData({
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        image_url: '',
        sort_order: 0,
        is_active: true,
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving category:', error);
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
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {category ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
          </DialogTitle>
          <DialogDescription>
            {category ? 'تعديل بيانات التصنيف' : 'إضافة تصنيف جديد للقائمة'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : (category ? 'تحديث' : 'إضافة')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;