'use client';

import {useParams, useRouter} from 'next/navigation';
import supabase from '@/app/utils/supabase';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown } from "lucide-react";

export default function UserDeletePage() {
    const {id} = useParams();
    const router = useRouter();
    const [usuario,setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        getUser();
    },[]);

    const getUser = async() => {
        setLoading(true);
        const {data} = await supabase
                                    .from("usuarios")
                                    .select("id, nombre")
                                    .eq("id",id)
                                    .single();
        
        setUsuario(data);
        setLoading(false);
    }

    const deleteUser = async() => {
        const { error } = await supabase.rpc('delete_user_and_dependencies', {
            user_id_to_delete: id 
        });
        
        if (error) {
            alert(`Error fatal al eliminar. Mensaje: ${error.message}.`);
            return null;
        }
        return true;
    }

    const handleDelete = async () => {
        const success = await deleteUser(); 
        if (success) {
            alert(`Usuario ${usuario.nombre} eliminado exitosamente.`);
            router.push('/usuarios');
        }
    };

    if (loading) return <div className="container mx-auto p-6">Cargando datos del usuario...</div>;

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h2 className="text-3xl font-bold mb-6">Eliminar Usuario</h2>
            
            {usuario ? (
                <Card className="p-6">
                    <CardTitle className="mb-2 text-xl">Confirmación Requerida</CardTitle>
                    <CardContent>
                        <p className="mb-4">¿Está seguro que desea eliminar al usuario: <strong className="text-destructive">{usuario.nombre}</strong>?</p>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <Button onClick={handleDelete} variant="destructive">Sí, Eliminar</Button>
                            <Button onClick={() => router.push('/usuarios')} variant="outline">Cancelar</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : ( 
                <Alert>
                    <Frown className="h-4 w-4" />
                    <AlertTitle>No Encontrado</AlertTitle>
                    <AlertDescription>El usuario ya no existe o el ID es incorrecto.</AlertDescription>
                </Alert>
            )}
        </div>
    );
}