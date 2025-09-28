'use client';

import { useParams, useRouter } from 'next/navigation';
import supabase from '@/app/utils/supabase';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Frown, Terminal } from "lucide-react";

export default function CargoDeletePage() {
    const { id } = useParams();
    const router = useRouter();
    const [cargo, setCargo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCargo();
    }, []);

    const getCargo = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("cargos")
            .select("id, cargo")
            .eq("id", id)
            .single();

        setCargo(data);
        setLoading(false);
    }

    const deleteCargo = async () => {
        const { error } = await supabase
            .from('cargos')
            .delete()
            .eq('id', id);

        if (error) {
            setError(`Error: ${error.message}.`);
            return null;
        }
        return true;
    }

    const handleDelete = async () => {
        const success = await deleteCargo();
        if (success) {
            alert(`Cargo ${cargo.cargo} eliminado exitosamente.`);
            router.push('/cargos');
        }
    };

    if (loading) return <div className="container mx-auto p-6">Cargando datos del cargo...</div>;

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h2 className="text-3xl font-bold mb-6">Eliminar Cargo</h2>

            {cargo ? (
                <Card className="p-6">
                    <CardTitle className="mb-2 text-xl">Confirmación Requerida</CardTitle>
                    <CardContent>
                        <p className="mb-4">¿Está seguro que desea eliminar el cargo: <strong className="text-destructive">{cargo.cargo}</strong>?</p>
                        
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Error de Eliminación</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end space-x-3 mt-6">
                            <Button onClick={handleDelete} variant="destructive">Sí, Eliminar</Button>
                            <Button onClick={() => router.push('/cargos')} variant="outline">Cancelar</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Alert>
                    <Frown className="h-4 w-4" />
                    <AlertTitle>No Encontrado</AlertTitle>
                    <AlertDescription>El cargo ya no existe o el ID es incorrecto.</AlertDescription>
                </Alert>
            )}
        </div>
    );
}