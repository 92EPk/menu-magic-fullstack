import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SpecialOffer } from "@/hooks/useDatabase";

interface SpecialOfferDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  specialOffer?: SpecialOffer | null;
  onSave: (offerData: any) => Promise<void>;
  loading?: boolean;
}

const SpecialOfferDialog = ({ isOpen, onOpenChange, specialOffer, onSave, loading }: SpecialOfferDialogProps) => {
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    image_url: '',
    discount_percentage: '',
    discount_amount: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    if (specialOffer) {
      setFormData({
        title_ar: specialOffer.title_ar,
        title_en: specialOffer.title_en,
        description_ar: specialOffer.description_ar || '',
        description_en: specialOffer.description_en || '',
        image_url: specialOffer.image_url || '',
        discount_percentage: specialOffer.discount_percentage?.toString() || '',
        discount_amount: specialOffer.discount_amount?.toString() || '',
        valid_from: specialOffer.valid_from ? new Date(specialOffer.valid_from).toISOString().slice(0, 16) : '',
        valid_until: specialOffer.valid_until ? new Date(specialOffer.valid_until).toISOString().slice(0, 16) : '',
        is_active: specialOffer.is_active,
        sort_order: specialOffer.sort_order
      });
    } else if (isOpen) {
      setFormData({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        image_url: '',
        discount_percentage: '',
        discount_amount: '',
        valid_from: '',
        valid_until: '',
        is_active: true,
        sort_order: 0
      });
    }
  }, [specialOffer, isOpen]);

  const handleSubmit = async () => {
    const submitData = {
      ...formData,
      discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : null,
      discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
      valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : new Date().toISOString(),
      valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
    };

    await onSave(submitData);
    onOpenChange(false);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {specialOffer ? 'تعديل العرض الخاص' : 'إضافة عرض خاص جديد'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title_ar">العنوان بالعربية *</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => handleChange('title_ar', e.target.value)}
                placeholder="العنوان بالعربية"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title_en">العنوان بالإنجليزية *</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => handleChange('title_en', e.target.value)}
                placeholder="Title in English"
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
                placeholder="الوصف بالعربية"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => handleChange('description_en', e.target.value)}
                placeholder="Description in English"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">رابط الصورة</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_percentage">نسبة الخصم (%)</Label>
              <Input
                id="discount_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => handleChange('discount_percentage', e.target.value)}
                placeholder="مثال: 25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount_amount">مبلغ الخصم (جنيه)</Label>
              <Input
                id="discount_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.discount_amount}
                onChange={(e) => handleChange('discount_amount', e.target.value)}
                placeholder="مثال: 50.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valid_from">بداية العرض</Label>
              <Input
                id="valid_from"
                type="datetime-local"
                value={formData.valid_from}
                onChange={(e) => handleChange('valid_from', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valid_until">نهاية العرض</Label>
              <Input
                id="valid_until"
                type="datetime-local"
                value={formData.valid_until}
                onChange={(e) => handleChange('valid_until', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort_order">ترتيب العرض</Label>
              <Input
                id="sort_order"
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleChange('is_active', checked)}
              />
              <Label htmlFor="is_active">العرض نشط</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'جاري الحفظ...' : (specialOffer ? 'تحديث العرض' : 'إضافة العرض')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialOfferDialog;