'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/app/utils/supabase';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, User, Clock, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterTickeoPage() {
    const [selectedUserId, setSelectedUserId] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDateTime, setCurrentDateTime] = useState({});
    const router = useRouter();

    // 💡 FUNCIÓN DE AYUDA DEFINIDA DENTRO DEL COMPONENTE (CORREGIDO)
    const getCurrentDateTime = () => {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].substring(0, 5);
        return { fecha: date, hora: time };
    }

    const updateDateTime = () => {
        const { fecha, hora } = getCurrentDateTime();
        setCurrentDateTime({ fecha: fecha, hora: hora });
    }

    useEffect(() => {
        fetchUsuarios();
        updateDateTime();
        const timer = setInterval(updateDateTime, 30000); 
        return () => clearInterval(timer);
    }, []);

    const fetchUsuarios = async () => {
        const { data: userData } = await supabase.from('usuarios').select('id, nombre');
        setUsuarios(userData || []);
        setLoading(false);
    }

    const createTickeo = async (isEntrada) => {
        if (!selectedUserId) {
            alert('Por favor, selecciona un usuario.');
            return;
        }

        // 🟢 AHORA getCurrentDateTime ESTÁ DEFINIDA Y FUNCIONARÁ AQUÍ
        const { fecha, hora } = getCurrentDateTime();
        
        const tickeoData = {
            id_usuario: parseInt(selectedUserId),
            fecha: fecha,
            hora: hora,
            tipo: isEntrada
        };

        const { error } = await supabase
            .from("tickeos")
            .insert([tickeoData]);
        
        if (error) {
            alert(`Error al registrar tickeo: ${error.message}`);
            return;
        }

        alert(`Tickeo de ${isEntrada ? 'ENTRADA' : 'SALIDA'} registrado para ${usuarios.find(u => String(u.id) === selectedUserId)?.nombre}`);
        router.push('/tickeos');
    }
    
    const handleCancel = () => {
        router.push('/tickeos');
    }

    if (loading) return <div className="container mx-auto p-6">Cargando usuarios...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Registro Rápido de Tickeo</h1>
            
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-6 w-6 text-blue-500" />
                        <span>Registrar Entrada o Salida</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor='id_usuario' className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Seleccionar Usuario:
                        </Label>
                        <Select onValueChange={setSelectedUserId} value={selectedUserId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar Usuario" />
                            </SelectTrigger>
                            <SelectContent>
                                {usuarios.map(user => (
                                    <SelectItem key={user.id} value={String(user.id)}>{user.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center space-x-2">
                            <CalendarDays className="h-5 w-5 text-gray-600" />
                            <div className='font-medium'>Fecha: {currentDateTime.fecha}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-gray-600" />
                            <div className='font-medium'>Hora Actual: {currentDateTime.hora}</div>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <Button
                            onClick={() => createTickeo(true)}
                            disabled={!selectedUserId}
                            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-lg"
                        >
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Entrada
                        </Button>
                        <Button
                            onClick={() => createTickeo(false)}
                            disabled={!selectedUserId}
                            className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-lg"
                        >
                            <XCircle className="mr-2 h-5 w-5" />
                            Salida
                        </Button>
                    </div>

                    <div className="flex justify-end">
                        <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
                    </div>
                    
                    {!selectedUserId && (
                        <p className="text-center text-sm text-gray-500 pt-2">
                            Selecciona un usuario para registrar el tickeo.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}