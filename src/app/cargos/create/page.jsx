'use client';

import { useRouter } from 'next/navigation';
import supabase from '@/app/utils/supabase';
import CargoForm from '@/components/CargoForm';

export default function CreateCargoPage() {
    const router = useRouter();

    const createCargo = async (cargoData) => {
        const { error } = await supabase
            .from("cargos")
            .insert([cargoData]);
        
        if (error) {
            alert(`Error al crear cargo: ${error.message}`);
            return null;
        }
        return true;
    }

    const handleSubmit = async (cargoData) => {
        const success = await createCargo(cargoData);
        if (success) {
            router.push('/cargos');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Crear Nuevo Cargo</h1>
            <CargoForm onSubmit={handleSubmit} isEditing={false} />
        </div>
    );
}