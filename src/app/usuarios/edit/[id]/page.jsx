'use client';

import { useParams, useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import supabase from '@/app/utils/supabase';
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditUserPage() {
    const {id} = useParams();
    const router = useRouter();
    const [usuario,setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if (id) {
            getUser();
        }
    },[id]);

    const getUser = async() => {
        setLoading(true);
        const {data} = await supabase
                                    .from("usuarios")
                                    .select("id, nombre, email, username, edad")
                                    .eq("id",id)
                                    .single();
        setUsuario(data);
        setLoading(false);
    }
    
    const updateUser = async(userData) => {
        let dataToUpdate = {...userData};
        if (!dataToUpdate.password) {
            delete dataToUpdate.password;
        }

        const {error} = await supabase
                                    .from("usuarios")
                                    .update(dataToUpdate)
                                    .eq("id",id);
        
        if(error){
            alert(`Error al actualizar usuario: ${error.message}`);
            return null;
        }
        return true;
    }
    
    const handleSubmit = async (userData) => {  
        const success = await updateUser(userData);
        if (success) {
            router.push('/usuarios');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-4 max-w-xl">
                <Skeleton className="h-10 w-3/4 mb-6" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error de Carga</AlertTitle>
                    <AlertDescription>No se pudo cargar el usuario con ID: {id}.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Editar Usuario: {usuario.nombre}</h1>
            <UserForm 
                onSubmit={handleSubmit} 
                editingUser={usuario}
                isEditing={true}
            />
        </div>
    );
}