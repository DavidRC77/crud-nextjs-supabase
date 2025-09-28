'use client';

import { useEffect, useState } from "react";
import supabase from '@/app/utils/supabase';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, PlusCircle, Clock } from "lucide-react";

export default function HorarioListPage() {
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHorarios();
    }, []);

    async function getHorarios() {
        setLoading(true);
        const { data } = await supabase
            .from("horarios")
            .select("*")
            .order('id', { ascending: true });

        setHorarios(data || []);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-4">
                <h1 className="text-3xl font-bold">Gestión de Horarios</h1>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Horarios</h1>
                <Button asChild>
                    <Link href="/horarios/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Horario
                    </Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Ingreso</TableHead>
                        <TableHead>Salida</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {horarios.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No hay horarios registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        horarios.map((horario) => (
                            <TableRow key={horario.id}>
                                <TableCell className="font-medium">{horario.id}</TableCell>
                                <TableCell><Clock className="inline h-4 w-4 mr-2 text-green-600"/>{horario.hora_ingreso}</TableCell>
                                <TableCell><Clock className="inline h-4 w-4 mr-2 text-red-600"/>{horario.hora_salida}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button asChild variant="secondary" size="sm">
                                        <Link href={`/horarios/edit/${horario.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="destructive" size="sm">
                                        <Link href={`/horarios/${horario.id}`}>
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