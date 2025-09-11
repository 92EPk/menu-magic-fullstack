import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  isSignature?: boolean;
}

interface MenuSectionProps {
  title: string;
  image: string;
  items: MenuItem[];
}

export const MenuSection = ({ title, image, items }: MenuSectionProps) => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center lg:text-left">
              {title}
            </h2>
            <div className="space-y-6">
              {items.map((item) => (
                <Card key={item.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        {item.name}
                        {item.isSignature && (
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                            Chef's Special
                          </span>
                        )}
                      </h3>
                      <span className="text-xl font-bold text-primary ml-4 shrink-0">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img 
                src={image} 
                alt={`${title} dishes`}
                className="w-full h-[400px] lg:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};