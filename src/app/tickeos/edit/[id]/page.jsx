'use client';

import { useParams, useRouter } from "next/navigation";
import TickeoForm from "@/components/TickeoForm";
import supabase from '@/app/utils/supabase';
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditTickeoPage() {
    const { id } = useParams();
    const router = useRouter();
    const [tickeo, setTickeo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getTickeo();
        }
    }, [id]);

    const getTickeo = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("tickeos")
            .select("id, id_usuario, fecha, hora, tipo")
            .eq("id", id)
            .single();
        
        setTickeo(data);
        setLoading(false);
    }

    const updateTickeo = async (tickeoData) => {
        const { error } = await supabase
            .from("tickeos")
            .update(tickeoData)
            .eq("id", id);
        
        if (error) {
            alert(`Error al actualizar tickeo: ${error.message}`);
            return null;
        }
        return true;
    }

    const handleSubmit = async (tickeoData) => {
        const success = await updateTickeo(tickeoData);
        if (success) {
            router.push('/tickeos');
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

    if (!tickeo) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>No se pudo cargar el tickeo con ID: {id}.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Editar Tickeo ID: {tickeo.id}</h1>
            <TickeoForm
                onSubmit={handleSubmit}
                editingTickeo={tickeo}
                isEditing={true}
            />
        </div>
    );
}