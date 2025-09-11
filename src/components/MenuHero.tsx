import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-restaurant.jpg";

export const MenuHero = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Elegant restaurant dining experience" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Bella Vista
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Experience culinary excellence with our carefully crafted menu featuring 
            fresh, locally-sourced ingredients and innovative flavor combinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="elegant" size="lg" className="text-lg px-8 py-6">
              View Our Menu
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20">
              Make Reservation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};