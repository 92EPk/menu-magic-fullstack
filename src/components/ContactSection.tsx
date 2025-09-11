import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock, MessageCircle, Mail, Star } from "lucide-react";

interface ContactSectionProps {
  language: 'ar' | 'en';
}

const ContactSection = ({ language }: ContactSectionProps) => {
  const translations = {
    ar: {
      contactUs: "تواصل معنا",
      contactSubtitle: "نحن هنا لخدمتك في أي وقت",
      phone: "الهاتف",
      address: "العنوان",
      workingHours: "ساعات العمل",
      whatsapp: "واتساب",
      email: "البريد الإلكتروني",
      callNow: "اتصل الآن",
      whatsappNow: "واتساب الآن",
      sendEmail: "أرسل إيميل",
      getDirections: "احصل على الاتجاهات",
      dailyHours: "يومياً من 10:00 ص إلى 2:00 ص",
      addressText: "شارع التحرير، وسط البلد، القاهرة، مصر",
      rating: "تقييم عملائنا",
      reviews: "تقييم",
      happyCustomers: "عميل سعيد"
    },
    en: {
      contactUs: "Contact Us",
      contactSubtitle: "We are here to serve you anytime",
      phone: "Phone",
      address: "Address",
      workingHours: "Working Hours",
      whatsapp: "WhatsApp",
      email: "Email",
      callNow: "Call Now",
      whatsappNow: "WhatsApp Now",
      sendEmail: "Send Email",
      getDirections: "Get Directions",
      dailyHours: "Daily from 10:00 AM to 2:00 AM",
      addressText: "Tahrir Street, Downtown, Cairo, Egypt",
      rating: "Customer Rating",
      reviews: "reviews",
      happyCustomers: "happy customers"
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: translations[language].phone,
      info: "+20 123 456 789",
      action: translations[language].callNow,
      color: "bg-primary text-primary-foreground",
      href: "tel:+201234567899"
    },
    {
      icon: MessageCircle,
      title: translations[language].whatsapp,
      info: "+20 123 456 789",
      action: translations[language].whatsappNow,
      color: "bg-accent text-accent-foreground",
      href: "https://wa.me/201234567899"
    },
    {
      icon: Mail,
      title: translations[language].email,
      info: "info@mixandtasteegypt.com",
      action: translations[language].sendEmail,
      color: "bg-secondary text-secondary-foreground",
      href: "mailto:info@mixandtasteegypt.com"
    },
    {
      icon: MapPin,
      title: translations[language].address,
      info: translations[language].addressText,
      action: translations[language].getDirections,
      color: "bg-neutral-dark text-white",
      href: "https://maps.google.com"
    }
  ];

  const stats = [
    { number: "4.9", label: translations[language].rating, icon: Star },
    { number: "1,200+", label: translations[language].reviews, icon: MessageCircle },
    { number: "15,000+", label: translations[language].happyCustomers, icon: Phone }
  ];

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <section id="contact" className="py-20 bg-background-cream/50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t.contactUs}
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t.contactSubtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-primary/10 text-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className={`text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((contact, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className={`${contact.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <contact.icon className="h-8 w-8" />
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                  {contact.title}
                </h3>
                
                <p className={`text-muted-foreground mb-4 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                  {contact.info}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  asChild
                >
                  <a href={contact.href} target="_blank" rel="noopener noreferrer">
                    {contact.action}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Working Hours */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="bg-accent/10 text-accent p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8" />
            </div>
            
            <h3 className={`text-2xl font-bold mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {t.workingHours}
            </h3>
            
            <p className={`text-xl text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              {t.dailyHours}
            </p>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="tel:+201234567899">
                  <Phone className="h-4 w-4 mr-2" />
                  {t.callNow}
                </a>
              </Button>
              
              <Button variant="accent" size="lg" asChild>
                <a href="https://wa.me/201234567899" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t.whatsappNow}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;