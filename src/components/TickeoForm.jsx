'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/app/utils/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TickeoForm = ({ onSubmit, editingTickeo = {}, isEditing = false }) => {
    const [formData, setFormData] = useState({
        id_usuario: editingTickeo.id_usuario ? String(editingTickeo.id_usuario) : '',
        fecha: editingTickeo.fecha ? new Date(editingTickeo.fecha) : new Date(),
        hora: editingTickeo.hora || '',
        tipo: editingTickeo.tipo === true || editingTickeo.tipo === false ? String(editingTickeo.tipo) : 'true',
    });
    const [usuarios, setUsuarios] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetchDependencies();
        if (isEditing && editingTickeo.id) {
            setFormData({
                id_usuario: String(editingTickeo.id_usuario) || '',
                fecha: editingTickeo.fecha ? new Date(editingTickeo.fecha) : new Date(),
                hora: editingTickeo.hora || '',
                tipo: String(editingTickeo.tipo),
            });
        }
    }, [editingTickeo, isEditing]);

    const fetchDependencies = async () => {
        const { data: userData } = await supabase.from('usuarios').select('id, nombre');
        setUsuarios(userData || []);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let dataToSubmit = { 
            id_usuario: parseInt(formData.id_usuario),
            fecha: formData.fecha.toISOString().split('T')[0],
            hora: formData.hora,
            tipo: formData.tipo === 'true'
        };

        if (isEditing) {
            dataToSubmit.id = editingTickeo.id;
        }

        onSubmit(dataToSubmit);
    }

    const handleCancel = () => {
        router.push('/tickeos');
    }

    return (
        <div className="max-w-xl mx-auto border p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor='id_usuario'>Usuario:</Label>
                    <Select onValueChange={(value) => handleSelectChange('id_usuario', value)} value={formData.id_usuario} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Usuario" />
                        </SelectTrigger>
                        <SelectContent>
                            {usuarios.map(user => (
                                <SelectItem key={user.id} value={String(user.id)}>{user.nombre}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor='fecha'>Fecha:</Label>
                        <Input type="date" id="fecha" name="fecha" value={formData.fecha ? formData.fecha.toISOString().split('T')[0] : ''} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor='hora'>Hora:</Label>
                        <Input type="time" id="hora" name="hora" value={formData.hora} onChange={handleChange} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor='tipo'>Tipo:</Label>
                    <Select onValueChange={(value) => handleSelectChange('tipo', value)} value={formData.tipo} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Entrada</SelectItem>
                            <SelectItem value="false">Salida</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="submit">Actualizar Tickeo</Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
                </div>
            </form>
        </div>
    )
}
export default TickeoForm;