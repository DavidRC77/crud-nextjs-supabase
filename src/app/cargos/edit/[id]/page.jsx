'use client';

import { useParams, useRouter } from "next/navigation";
import CargoForm from "@/components/CargoForm";
import supabase from '@/app/utils/supabase';
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCargoPage() {
    const { id } = useParams();
    const router = useRouter();
    const [cargo, setCargo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getCargo();
        }
    }, [id]);

    const getCargo = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("cargos")
            .select("*")
            .eq("id", id)
            .single();
        
        setCargo(data);
        setLoading(false);
    }

    const updateCargo = async (cargoData) => {
        const { error } = await supabase
            .from("cargos")
            .update(cargoData)
            .eq("id", id);
        
        if (error) {
            alert(`Error al actualizar cargo: ${error.message}`);
            return null;
        }
        return true;
    }

    const handleSubmit = async (cargoData) => {
        const success = await updateCargo(cargoData);
        if (success) {
            router.push('/cargos');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-4 max-w-xl">
                <Skeleton className="h-10 w-3/4 mb-6" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (!cargo) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>No se pudo cargar el cargo con ID: {id}.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Editar Cargo: {cargo.cargo}</h1>
            <CargoForm
                onSubmit={handleSubmit}
                editingCargo={cargo}
                isEditing={true}
            />
        </div>
    );
}