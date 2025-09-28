'use client';

import { useEffect, useState } from "react";
import supabase from '@/app/utils/supabase';
import UserList from "@/components/UserList";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserListPage() {
    const [usuarios,setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      getUsuarios();
    }, []);

    async function getUsuarios() {
      setLoading(true);
      
      const { data } = await supabase
        .from("usuarios")
        .select(`
          id, 
          nombre, 
          email, 
          username, 
          edad,
          cargos_usuarios (
            fecha_inicio,
            cargos (
              cargo
            )
          )
        `)
        .order('fecha_inicio', { foreignTable: 'cargos_usuarios', ascending: false }); 
      
      setUsuarios(data || []);
      setLoading(false);
    }

    if (loading) {
      return (
        <div className="container mx-auto p-6 space-y-4">
          <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
    }

    return (
      <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
          <UserList usuarios={usuarios} />
      </div>
    );
}