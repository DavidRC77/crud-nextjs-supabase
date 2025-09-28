'use client';

import { useRouter } from 'next/navigation';
import supabase from '@/app/utils/supabase';
import HorarioForm from '@/components/HorarioForm';

export default function CreateHorarioPage() {
    const router = useRouter();

    const createHorario = async (horarioData) => {
        const { error } = await supabase
            .from("horarios")
            .insert([horarioData]);
        
        if (error) {
            alert(`Error al crear horario: ${error.message}`);
            return null;
        }
        return true;
    }

    const handleSubmit = async (horarioData) => {
        const success = await createHorario(horarioData);
        if (success) {
            router.push('/horarios');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Crear Nuevo Horario</h1>
            <HorarioForm onSubmit={handleSubmit} isEditing={false} />
        </div>
    );
}