'use client';

import { useParams, useRouter } from 'next/navigation';
import supabase from '@/app/utils/supabase';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown, Terminal } from "lucide-react";

export default function TickeoDeletePage() {
    const { id } = useParams();
    const router = useRouter();
    const [tickeo, setTickeo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getTickeo();
    }, []);

    const getTickeo = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("tickeos")
            .select("id, fecha, hora, tipo, usuarios(nombre)")
            .eq("id", id)
            .single();

        setTickeo(data);
        setLoading(false);
    }

    const deleteTickeo = async () => {
        const { error } = await supabase
            .from('tickeos')
            .delete()
            .eq('id', id);

        if (error) {
            setError(`Error al eliminar: ${error.message}.`);
            return null;
        }
        return true;
    }

    const handleDelete = async () => {
        const success = await deleteTickeo();
        if (success) {
            alert(`Tickeo eliminado exitosamente.`);
            router.push('/tickeos');
        }
    };

    if (loading) return <div className="container mx-auto p-6">Cargando datos del tickeo...</div>;

    const tickeoType = tickeo?.tipo ? 'Entrada' : 'Salida';
    const tickeoInfo = tickeo ? 
        `${tickeoType} de ${tickeo.usuarios.nombre} el ${tickeo.fecha} a las ${tickeo.hora}` : 
        'el tickeo seleccionado';

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h2 className="text-3xl font-bold mb-6">Eliminar Tickeo</h2>

            {tickeo ? (
                <Card className="p-6">
                    <CardTitle className="mb-2 text-xl">Confirmación Requerida</CardTitle>
                    <CardContent>
                        <p className="mb-4">¿Está seguro que desea eliminar: <strong className="text-destructive">{tickeoInfo}</strong>?</p>
                        
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Error de Eliminación</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end space-x-3 mt-6">
                            <Button onClick={handleDelete} variant="destructive">Sí, Eliminar</Button>
                            <Button onClick={() => router.push('/tickeos')} variant="outline">Cancelar</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Alert>
                    <Frown className="h-4 w-4" />
                    <AlertTitle>No Encontrado</AlertTitle>
                    <AlertDescription>El tickeo ya no existe o el ID es incorrecto.</AlertDescription>
                </Alert>
            )}
        </div>
    );
}