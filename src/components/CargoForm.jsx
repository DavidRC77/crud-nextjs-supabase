'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CargoForm = ({ onSubmit, editingCargo = {}, isEditing = false }) => {
    const [formData, setFormData] = useState({
        cargo: editingCargo.cargo || '',
        sueldo: editingCargo.sueldo || ''
    });
    const router = useRouter();

    useEffect(() => {
        if (isEditing && editingCargo.id) {
            setFormData({
                cargo: editingCargo.cargo || '',
                sueldo: editingCargo.sueldo ? String(editingCargo.sueldo) : ''
            });
        }
    }, [editingCargo, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let dataToSubmit = { ...formData };
        
        dataToSubmit.sueldo = parseFloat(dataToSubmit.sueldo);

        if (isEditing) {
            dataToSubmit.id = editingCargo.id;
        }

        onSubmit(dataToSubmit);
    }

    const handleCancel = () => {
        router.push('/cargos');
    }

    return (
        <div className="max-w-xl mx-auto border p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor='cargo'>Nombre del Cargo:</Label>
                    <Input
                        type="text"
                        id="cargo"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor='sueldo'>Sueldo:</Label>
                    <Input
                        type="number"
                        id="sueldo"
                        name="sueldo"
                        value={formData.sueldo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="submit">{isEditing ? 'Actualizar Cargo' : 'Crear Cargo'}</Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
                </div>
            </form>
        </div>
    )
}
export default CargoForm;