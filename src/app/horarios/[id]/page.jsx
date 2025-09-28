'use client';

import { useParams, useRouter } from 'next/navigation';
import supabase from '@/app/utils/supabase';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown, Terminal } from "lucide-react";

export default function HorarioDeletePage() {
    const { id } = useParams();
    const router = useRouter();
    const [horario, setHorario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getHorario();
    }, []);

    const getHorario = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("horarios")
            .select("id, hora_ingreso, hora_salida")
            .eq("id", id)
            .single();

        setHorario(data);
        setLoading(false);
    }

    const deleteHorario = async () => {
        const { error } = await supabase
            .from('horarios')
            .delete()
            .eq('id', id);

        if (error) {
            setError(`Error al eliminar: ${error.message}.`);
            return null;
        }
        return true;
    }

    const handleDelete = async () => {
        const success = await deleteHorario();
        if (success) {
            alert(`Horario ${horario.hora_ingreso} - ${horario.hora_salida} eliminado exitosamente.`);
            router.push('/horarios');
        }
    };

    if (loading) return <div className="container mx-auto p-6">Cargando datos del horario...</div>;

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h2 className="text-3xl font-bold mb-6">Eliminar Horario</h2>

            {horario ? (
                <Card className="p-6">
                    <CardTitle className="mb-2 text-xl">Confirmación Requerida</CardTitle>
                    <CardContent>
                        <p className="mb-4">¿Está seguro que desea eliminar el horario: <strong className="text-destructive">{horario.hora_ingreso} - {horario.hora_salida}</strong>?</p>
                        
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Error de Eliminación</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end space-x-3 mt-6">
                            <Button onClick={handleDelete} variant="destructive">Sí, Eliminar</Button>
                            <Button onClick={() => router.push('/horarios')} variant="outline">Cancelar</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Alert>
                    <Frown className="h-4 w-4" />
                    <AlertTitle>No Encontrado</AlertTitle>
                    <AlertDescription>El horario ya no existe o el ID es incorrecto.</AlertDescription>
                </Alert>
            )}
        </div>
    );
}