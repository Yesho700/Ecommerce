import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Globe, Heart } from "lucide-react";

const About = () => {
  const stats = [
    { value: "2019", label: "Founded" },
    { value: "50K+", label: "Happy Customers" },
    { value: "100+", label: "Premium Products" },
    { value: "15", label: "Countries Shipped" },
  ];

  const values = [
    {
      icon: Award,
      title: "Quality First",
      description: "We source only the finest materials and work with skilled artisans to create products that last.",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Your satisfaction is our priority. Our WhatsApp support ensures you always have help when needed.",
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "We're committed to reducing our environmental impact through responsible sourcing and packaging.",
    },
    {
      icon: Heart,
      title: "Passion Driven",
      description: "Every product we offer is something we'd proudly use ourselves. That's our promise to you.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-up">
              Crafting <span className="gradient-text">Premium</span> Experiences
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up animation-delay-100">
              StellarShop was born from a simple belief: everyone deserves access to beautifully designed, 
              high-quality products that enhance their daily lives.
            </p>
            <Link to="/shop" className="animate-fade-up animation-delay-200 inline-block">
              <Button variant="gradient" size="lg">
                Explore Our Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-border mb-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Our <span className="gradient-text">Story</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Started in 2019 by a team of design enthusiasts, StellarShop began as a small 
                curated collection of products we personally loved. What started as a passion 
                project quickly grew as more people discovered our commitment to quality.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we serve customers in over 15 countries, but our mission remains the same: 
                to bring you thoughtfully designed products that combine functionality with 
                aesthetic excellence.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every product in our collection goes through a rigorous selection process. 
                We test, we use, and we love everything we sell. That's our promise to you.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden glass-card">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800"
                  alt="Our team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/30 rounded-full blur-[60px]" />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            What We <span className="gradient-text">Stand For</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="glass-card rounded-2xl p-6 hover-lift animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
