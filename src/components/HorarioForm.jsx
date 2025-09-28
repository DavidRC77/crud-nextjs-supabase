'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const HorarioForm = ({ onSubmit, editingHorario = {}, isEditing = false }) => {
    const [formData, setFormData] = useState({
        hora_ingreso: editingHorario.hora_ingreso || '',
        hora_salida: editingHorario.hora_salida || ''
    });
    const router = useRouter();

    useEffect(() => {
        if (isEditing && editingHorario.id) {
            setFormData({
                hora_ingreso: editingHorario.hora_ingreso || '',
                hora_salida: editingHorario.hora_salida || ''
            });
        }
    }, [editingHorario, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let dataToSubmit = { ...formData };
        
        if (isEditing) {
            dataToSubmit.id = editingHorario.id;
        }

        onSubmit(dataToSubmit);
    }

    const handleCancel = () => {
        router.push('/horarios');
    }

    return (
        <div className="max-w-xl mx-auto border p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor='hora_ingreso'>Hora de Ingreso:</Label>
                    <Input
                        type="time"
                        id="hora_ingreso"
                        name="hora_ingreso"
                        value={formData.hora_ingreso}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor='hora_salida'>Hora de Salida:</Label>
                    <Input
                        type="time"
                        id="hora_salida"
                        name="hora_salida"
                        value={formData.hora_salida}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="submit">{isEditing ? 'Actualizar Horario' : 'Crear Horario'}</Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
                </div>
            </form>
        </div>
    )
}
export default HorarioForm;