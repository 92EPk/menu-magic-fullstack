import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCustomizationOptions, useCategories, CustomizationOption } from "@/hooks/useDatabase";

interface CustomizationOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  option: CustomizationOption | null;
}

const CustomizationOptionsDialog = ({ isOpen, onClose, option }: CustomizationOptionsDialogProps) => {
  const [formData, setFormData] = useState({
    category_id: '',
    option_type: '',
    name_ar: '',
    name_en: '',
    price: 0,
    is_required: false,
    is_active: true,
    sort_order: 0
  });

  const { addCustomizationOption, updateCustomizationOption } = useCustomizationOptions();
  const { categories } = useCategories();

  const isEditing = !!option;

  useEffect(() => {
    if (option) {
      setFormData({
        category_id: option.category_id,
        option_type: option.option_type,
        name_ar: option.name_ar,
        name_en: option.name_en,
        price: option.price,
        is_required: option.is_required,
        is_active: option.is_active,
        sort_order: option.sort_order
      });
    } else {
      setFormData({
        category_id: '',
        option_type: '',
        name_ar: '',
        name_en: '',
        price: 0,
        is_required: false,
        is_active: true,
        sort_order: 0
      });
    }
  }, [option]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && option) {
        await updateCustomizationOption(option.id, formData);
      } else {
        await addCustomizationOption(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving customization option:', error);
    }
  };

  const optionTypes = [
    { value: 'bread', label: 'Bread / العيش' },
    { value: 'sauce', label: 'Sauce / الصوص' },
    { value: 'presentation', label: 'Presentation / طريقة التقديم' },
    { value: 'pasta_sauce', label: 'Pasta Sauce / صوص المكرونة' },
    { value: 'size', label: 'Size / الحجم' },
    { value: 'extras', label: 'Extras / إضافات' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Customization Option' : 'Add New Customization Option'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name_en} / {category.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Option Type */}
          <div className="space-y-2">
            <Label htmlFor="option_type">Option Type</Label>
            <Select
              value={formData.option_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, option_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option type" />
              </SelectTrigger>
              <SelectContent>
                {optionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Arabic Name */}
          <div className="space-y-2">
            <Label htmlFor="name_ar">Arabic Name</Label>
            <Input
              id="name_ar"
              value={formData.name_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
              placeholder="الاسم بالعربية"
              className="text-right"
              dir="rtl"
              required
            />
          </div>

          {/* English Name */}
          <div className="space-y-2">
            <Label htmlFor="name_en">English Name</Label>
            <Input
              id="name_en"
              value={formData.name_en}
              onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
              placeholder="Name in English"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (EGP)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
            />
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              type="number"
              min="0"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_required">Required Option</Label>
              <Switch
                id="is_required"
                checked={formData.is_required}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_required: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update' : 'Add'} Option
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationOptionsDialog;