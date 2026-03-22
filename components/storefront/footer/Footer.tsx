import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from '@/components/icons';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-border/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1 */}
          <div className="space-y-4">
             <Link href="/">
               <Image src="/logo/Globs-by-logo.png" alt="Globs-By Logo" width={140} height={48} className="object-contain" />
             </Link>
             <p className="text-sm text-primary-foreground/80 leading-relaxed mt-4">
               Your reliable, affordable, and quality-driven partner for premium stationery and office supplies across Tanzania.
             </p>
             <div className="flex gap-4 pt-4">
               <Link href="#" className="p-2 rounded-full bg-white/10 hover:bg-accent text-white transition-colors">
                 <Instagram className="h-4 w-4" />
               </Link>
               <Link href="#" className="p-2 rounded-full bg-white/10 hover:bg-accent text-white transition-colors">
                 <Facebook className="h-4 w-4" />
               </Link>
               <Link href="#" className="p-2 rounded-full bg-white/10 hover:bg-accent text-white transition-colors">
                 <Twitter className="h-4 w-4" />
               </Link>
             </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4 lg:pl-8">
            <h4 className="font-heading font-normal text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/shop" className="hover:text-accent transition-colors">Our Shop</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-4 lg:pl-4">
            <h4 className="font-heading font-normal text-lg">Categories</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/category/office-supplies" className="hover:text-accent transition-colors">Office Supplies</Link></li>
              <li><Link href="/category/tech-accessories" className="hover:text-accent transition-colors">Tech Accessories</Link></li>
              <li><Link href="/category/art-supplies" className="hover:text-accent transition-colors">Art Supplies</Link></li>
              <li><Link href="/category/printing-services" className="hover:text-accent transition-colors">Brand & Print Services</Link></li>
              <li><Link href="/category/business-machines" className="hover:text-accent transition-colors">Business Machines</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-4">
            <h4 className="font-heading font-normal text-lg">Contact Us</h4>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <p>Dar Es Salaam Branch:<br/>Kariakoo, DSM</p>
              <p>Mbeya Branch:<br/>Mwanjelwa, Mbeya</p>
              <p className="pt-2 font-medium text-white">+255 (0) 123 456 789</p>
              <p className="text-accent">info@globsby.co.tz</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Globs-By Limited. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
