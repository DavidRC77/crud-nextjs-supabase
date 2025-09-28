'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from '@/app/utils/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function AsignarCargoPage() {
    const { id } = useParams();
    const router = useRouter();
    const [cargos, setCargos] = useState([]);
    const [selectedCargoId, setSelectedCargoId] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchCargos();
        }
    }, [id]);

    const fetchCargos = async () => {
        const { data, error } = await supabase
            .from('cargos')
            .select('id, cargo');
        
        if (error) {
            setError('Error al cargar cargos: ' + error.message);
        } else {
            setCargos(data);
            if (data.length > 0) {
                setSelectedCargoId(data[0].id);
            }
        }
        setLoading(false);
    };

    const assignCargo = async () => {
        if (!selectedCargoId) {
            alert("Por favor, selecciona un cargo.");
            return;
        }

        const formattedDate = fechaInicio.toISOString().split('T')[0];

        const { error: insertError } = await supabase
            .from('cargos_usuarios')
            .insert([
                { 
                    id_usuario: id, 
                    id_cargo: selectedCargoId, 
                    fecha_inicio: formattedDate 
                }
            ]);

        if (insertError) {
            alert(`Error al asignar cargo: ${insertError.message}`);
        } else {
            alert('Cargo asignado exitosamente.');
            router.push('/usuarios');
        }
    };

    if (loading) return <div className="container mx-auto p-6">Cargando cargos disponibles...</div>;

    if (error) {
        return (
            <div className="container mx-auto p-6 max-w-lg">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h1 className="text-3xl font-bold mb-6">Asignar Cargo a Usuario ID: {id}</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Selección de Cargo y Fecha</CardTitle>
                    <CardDescription>Establece el nuevo cargo y la fecha de inicio para este usuario.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    
                    <div className="space-y-2">
                        <Label htmlFor="cargo-select">Cargo:</Label>
                        <Select onValueChange={(value) => setSelectedCargoId(value)} defaultValue={String(selectedCargoId)}>
                            <SelectTrigger id="cargo-select">
                                <SelectValue placeholder="Seleccionar Cargo" />
                            </SelectTrigger>
                            <SelectContent>
                                {cargos.map(cargo => (
                                    <SelectItem key={cargo.id} value={String(cargo.id)}>
                                        {cargo.cargo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Fecha de Inicio:</Label>
                        <div className="flex justify-center border rounded-md p-2">
                            <Calendar
                                mode="single"
                                selected={fechaInicio}
                                onSelect={setFechaInicio}
                                initialFocus
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button onClick={assignCargo}>Asignar Cargo</Button>
                        <Button onClick={() => router.push('/usuarios')} variant="outline">Cancelar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}