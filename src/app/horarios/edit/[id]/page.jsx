'use client';

import { useParams, useRouter } from "next/navigation";
import HorarioForm from "@/components/HorarioForm";
import supabase from '@/app/utils/supabase';
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditHorarioPage() {
    const { id } = useParams();
    const router = useRouter();
    const [horario, setHorario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getHorario();
        }
    }, [id]);

    const getHorario = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("horarios")
            .select("*")
            .eq("id", id)
            .single();
        
        setHorario(data);
        setLoading(false);
    }

    const updateHorario = async (horarioData) => {
        const { error } = await supabase
            .from("horarios")
            .update(horarioData)
            .eq("id", id);
        
        if (error) {
            alert(`Error al actualizar horario: ${error.message}`);
            return null;
        }
        return true;
    }

    const handleSubmit = async (horarioData) => {
        const success = await updateHorario(horarioData);
        if (success) {
            router.push('/horarios');
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

    if (!horario) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>No se pudo cargar el horario con ID: {id}.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Editar Horario ID: {horario.id}</h1>
            <HorarioForm
                onSubmit={handleSubmit}
                editingHorario={horario}
                isEditing={true}
            />
        </div>
    );
}