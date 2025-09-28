'use client';

import { useEffect, useState } from "react";
import supabase from '@/app/utils/supabase';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, PlusCircle, CalendarDays, User, Clock, ArrowRight, ArrowLeft } from "lucide-react";

export default function TickeoListPage() {
    const [tickeos, setTickeys] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTickeys();
    }, []);

    async function getTickeys() {
        setLoading(true);
        const { data } = await supabase
            .from("tickeos")
            .select(`
                id,
                fecha,
                hora,
                tipo,
                usuarios (nombre)
            `)
            .order('id', { ascending: true });

        setTickeys(data || []);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-4">
                <h1 className="text-3xl font-bold">Gestión de Tickeos</h1>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Tickeos</h1>
                <Button asChild>
                    <Link href="/tickeos/create"> 
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Registrar Tickeo
                    </Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickeos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No hay tickeos registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        tickeos.map((tickeo) => (
                            <TableRow key={tickeo.id}>
                                <TableCell className="font-medium">{tickeo.id}</TableCell>
                                <TableCell>
                                    <User className="inline h-4 w-4 mr-1 text-blue-500" />
                                    {tickeo.usuarios.nombre}
                                </TableCell>
                                <TableCell>
                                    <CalendarDays className="inline h-4 w-4 mr-1 text-gray-500" />
                                    {tickeo.fecha}
                                </TableCell>
                                <TableCell>
                                    <Clock className="inline h-4 w-4 mr-1 text-purple-500" />
                                    {tickeo.hora}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tickeo.tipo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {tickeo.tipo ? 'Entrada' : 'Salida'}
                                        {tickeo.tipo ? <ArrowRight className="inline h-3 w-3 ml-1" /> : <ArrowLeft className="inline h-3 w-3 ml-1" />}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button asChild variant="secondary" size="sm">
                                        <Link href={`/tickeos/edit/${tickeo.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="destructive" size="sm">
                                        <Link href={`/tickeos/${tickeo.id}`}>
                                            <Trash2 className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}