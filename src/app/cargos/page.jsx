'use client';

import { useEffect, useState } from "react";
import supabase from '@/app/utils/supabase';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, PlusCircle, Users } from "lucide-react";

export default function CargoListPage() {
    const [cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCargos();
    }, []);

    async function getCargos() {
        setLoading(true);
        const { data } = await supabase
            .from("cargos")
            .select("*")
            .order('id', { ascending: true });

        setCargos(data || []);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-4">
                <h1 className="text-3xl font-bold">Gestión de Cargos</h1>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Cargos</h1>
                <Button asChild>
                    <Link href="/cargos/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Cargo
                    </Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Sueldo</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cargos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No hay cargos registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        cargos.map((cargo) => (
                            <TableRow key={cargo.id}>
                                <TableCell className="font-medium">{cargo.id}</TableCell>
                                <TableCell>{cargo.cargo}</TableCell>
                                <TableCell>Bs. {cargo.sueldo.toLocaleString('es-CL')}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button asChild variant="secondary" size="sm">
                                        <Link href={`/cargos/edit/${cargo.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="destructive" size="sm">
                                        <Link href={`/cargos/${cargo.id}`}>
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