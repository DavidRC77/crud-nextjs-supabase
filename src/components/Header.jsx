'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Building, Clock, Ticket, Search } from "lucide-react";

export function Header() {
  return (
    <header className="border-b p-4 flex justify-between items-center bg-background shadow-lg sticky top-0 z-10">
      
      <Link href="/" className="text-2xl font-extrabold tracking-tight hover:text-primary transition-colors">
        Diseño Web II
      </Link>
      
      <nav className="flex items-center space-x-2">
        
        <Button asChild variant="ghost" className="text-lg">
          <Link href="/usuarios">
            <Users className="h-4 w-4 mr-2" />
            Usuarios
          </Link>
        </Button>
        
        <Button asChild variant="ghost" className="text-lg">
          <Link href="/cargos">
            <Building className="h-4 w-4 mr-2" />
            Cargos
          </Link>
        </Button>
        
        <Button asChild variant="ghost" className="text-lg">
          <Link href="/horarios">
            <Clock className="h-4 w-4 mr-2" />
            Horarios
          </Link>
        </Button>
        
        <Button asChild variant="ghost" className="text-lg">
          <Link href="/tickeos">
            <Ticket className="h-4 w-4 mr-2" />
            Tickeos
          </Link>
        </Button>

        <Button asChild variant="ghost" className="text-lg">
          <Link href="/consultas">
            <Search className="h-4 w-4 mr-2" />
            Consultas
          </Link>
        </Button>

      </nav>
    </header>
  );
}