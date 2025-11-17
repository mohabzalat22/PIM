import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/40">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-primary text-lg font-bold">X</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight">MOLAB PIM</span>
            <span className="text-xs text-muted-foreground">Product Information Platform</span>
          </div>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <Link to="/sign-in">
            <Button variant="ghost" size="sm" className="ml-2">
              Sign in
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button size="sm" className="hidden sm:inline-flex">
              Get started
            </Button>
          </Link>
        </nav>
      </motion.header>

      <main className="max-w-6xl mx-auto px-8 pb-20">
        <motion.section 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center pt-12 pb-16"
        >
          <motion.div variants={fadeInUp} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground shadow-sm"
            >
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-2 w-2 rounded-full bg-emerald-500" 
              />
              <span>Centralized EAV catalog for modern commerce</span>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                Keep all your product data in one reliable place.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
                MOLAB PIM gives you a single source of truth for products, attributes, locales, and assets designed for
                Magento-style EAV models and multi-store setups.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/sign-up">
                <Button size="lg">Start free</Button>
              </Link>
              <Link to="/sign-in">
                <Button variant="outline" size="lg">
                  Sign in to your workspace
                </Button>
              </Link>
              <span className="text-xs sm:text-sm text-muted-foreground">
                No credit card required. Clerk-powered secure auth.
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground">
              <div>
                <div className="text-foreground font-semibold">Multi-store aware</div>
                <p>Store views, locales, and channels aligned with your e-commerce stack.</p>
              </div>
              <div>
                <div className="text-foreground font-semibold">Attribute-first</div>
                <p>Flexible EAV model for complex catalogs and integrations.</p>
              </div>
              <div>
                <div className="text-foreground font-semibold">Built for teams</div>
                <p>Collaborate on data changes and keep everything versioned and auditable.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="relative mt-4 lg:mt-0"
          >
            <div className="absolute inset-0 blur-3xl bg-primary/20 -z-10 rounded-3xl" />
            <Card className="border shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle>Catalog at a glance</CardTitle>
                <CardDescription>
                  A snapshot of how your product data is organized in MOLAB PIM.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Products</span>
                  <span className="font-medium">12,480</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Attributes</span>
                  <span className="font-medium">214</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Locales</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Store views</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="mt-4 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                  Real-time sync and validation ensure your Magento or custom storefronts always read clean data.
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t pt-4 mt-2">
                <span className="text-xs text-muted-foreground">Designed for engineering and merch teams.</span>
                <Link to="/sign-up">
                  <Button size="sm">Create workspace</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.section>

        <motion.section 
          id="features"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="py-10 space-y-6"
        >
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">Everything you need for PIM.</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              From attributes and categories to assets and localesMOLAB PIM gives you a structured workspace for all
              product data.
            </p>
          </div>
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-5 md:grid-cols-3"
          >
            <motion.div variants={fadeInUp}>
            <Card
              className="cursor-pointer transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle>Unified EAV model</CardTitle>
                <CardDescription>
                  Share attributes across products, categories, and channels without duplicated schemas.
                </CardDescription>
              </CardHeader>
            </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
            <Card
              className="cursor-pointer transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle>Store & locale aware</CardTitle>
                <CardDescription>
                  Manage localized labels, currencies, and store views the way Magento doesbut with a cleaner UI.
                </CardDescription>
              </CardHeader>
            </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
            <Card
              className="cursor-pointer transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle>Built for integrations</CardTitle>
                <CardDescription>
                  A backend-first design that plays well with Magento, headless storefronts, and internal tools.
                </CardDescription>
              </CardHeader>
            </Card>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section 
          id="pricing"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="py-10 space-y-6"
        >
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">Simple pricing that scales with you.</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Start free and upgrade only when your catalog and team grow.
            </p>
          </div>
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3"
          >
            <motion.div 
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>For solo developers and small catalogs getting started.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-2xl font-semibold">Free</div>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>Up to 1,000 products</li>
                  <li>Single store view</li>
                  <li>Core attributes & locales</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/sign-up" className="w-full">
                  <Button variant="outline" className="w-full">
                    Get started
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            </motion.div>
            <motion.div 
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
            <Card className="border-primary/40 shadow-md shadow-primary/20 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-emerald-500" />
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For growing teams managing multiple stores and locales.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-2xl font-semibold">$49/mo</div>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>Up to 25,000 products</li>
                  <li>Multiple store views & locales</li>
                  <li>Priority support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/sign-up" className="w-full">
                  <Button className="w-full">Start Pro trial</Button>
                </Link>
              </CardFooter>
            </Card>

            </motion.div>
            <motion.div 
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For teams with complex catalogs and custom integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-2xl font-semibold">Let&apos;s talk</div>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>Unlimited products</li>
                  <li>Custom SLAs & onboarding</li>
                  <li>Dedicated solutions engineer</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/sign-up" className="w-full">
                  <Button variant="outline" className="w-full">
                    Contact sales
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            </motion.div>
          </motion.div>
        </motion.section>

        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-6 mt-8 text-xs text-muted-foreground">
          <p> 2025 MOLAB PIM. All rights reserved.</p>
          <p>Authentication by Clerk.</p>
        </footer>
      </main>
    </div>
  );
}
