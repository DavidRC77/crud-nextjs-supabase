'use client';

import { useState, useEffect } from "react";
import supabase from '@/app/utils/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, DollarSign, Clock, Users, Briefcase, CalendarDays, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ConsultasPage = () => {
    const [cargos, setCargos] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [consultaType, setConsultaType] = useState('cargo_especifico');

    const [cargoName, setCargoName] = useState('');
    const [sueldoMin, setSueldoMin] = useState('');
    const [sueldoRangeMin, setSueldoRangeMin] = useState('');
    const [sueldoRangeMax, setSueldoRangeMax] = useState('');
    const [tardanzaHora, setTardanzaHora] = useState('08:00:00');
    const [tempranoHora, setTempranoHora] = useState('18:00:00');
    const [dependenciasLoading, setDependenciasLoading] = useState(true);

    useEffect(() => {
        getCargos();
    }, []);

    async function getCargos() {
        setDependenciasLoading(true);
        const { data } = await supabase.from("cargos").select("id, cargo").order('cargo');
        setCargos(data || []);
        setDependenciasLoading(false);
    }

    async function executeQuery() {
        setLoading(true);
        setResults([]);
        let data, error;

        switch (consultaType) {
            case 'cargo_especifico':
                if (!cargoName) { alert("Seleccione un cargo."); setLoading(false); return; }
                ({ data, error } = await supabase
                    .from("cargos_usuarios")
                    .select(`
                        usuarios:id_usuario (nombre, email),
                        cargos:id_cargo (cargo, sueldo)
                    `)
                    .eq('id_cargo', cargoName)
                    .not('cargos', 'is', null));
                break;

            case 'sueldo_mayor':
                if (!sueldoMin) { alert("Ingrese un sueldo mínimo."); setLoading(false); return; }
                ({ data, error } = await supabase
                    .from("cargos_usuarios")
                    .select(`
                        usuarios:id_usuario (nombre, email),
                        cargos:id_cargo (cargo, sueldo)
                    `)
                    .gte('cargos.sueldo', sueldoMin)
                    .not('cargos', 'is', null));
                break;
            
            case 'sueldo_rango':
                if (!sueldoRangeMin || !sueldoRangeMax) { alert("Ingrese ambos límites de sueldo."); setLoading(false); return; }
                ({ data, error } = await supabase
                    .from("cargos_usuarios")
                    .select(`
                        usuarios:id_usuario (nombre, email),
                        cargos:id_cargo (cargo, sueldo)
                    `)
                    .gte('cargos.sueldo', sueldoRangeMin)
                    .lte('cargos.sueldo', sueldoRangeMax)
                    .not('cargos', 'is', null));
                break;

            case 'llegada_tarde':
                ({ data, error } = await supabase
                    .from("tickeos")
                    .select(`
                        usuarios:id_usuario (nombre, email),
                        fecha,
                        hora
                    `)
                    .eq('tipo', true) 
                    .gt('hora', tardanzaHora)
                    .order('fecha', { ascending: false }));
                break;

            case 'salida_temprana':
                ({ data, error } = await supabase
                    .from("tickeos")
                    .select(`
                        usuarios:id_usuario (nombre, email),
                        fecha,
                        hora
                    `)
                    .eq('tipo', false) 
                    .lt('hora', tempranoHora)
                    .order('fecha', { ascending: false }));
                break;

            default:
                break;
        }

        if (error) {
            console.error(error);
            alert("Error al ejecutar la consulta.");
        } else {
            setResults(data || []);
        }
        setLoading(false);
    }

    const renderInputFields = () => {
        switch (consultaType) {
            case 'cargo_especifico':
                return (
                    <div className="space-y-2">
                        <Label>Seleccionar Cargo:</Label>
                        {dependenciasLoading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Select value={cargoName} onValueChange={setCargoName} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="-- Seleccione un cargo --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cargos.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.cargo}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                );
            case 'sueldo_mayor':
                return (
                    <div className="space-y-2">
                        <Label htmlFor="sueldoMin">Sueldo Mínimo (Bs):</Label>
                        <Input id="sueldoMin" type="number" value={sueldoMin} onChange={(e) => setSueldoMin(e.target.value)} required placeholder="Ej: 5000" />
                    </div>
                );
            case 'sueldo_rango':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="sueldoRangeMin">Sueldo Mínimo:</Label>
                            <Input id="sueldoRangeMin" type="number" value={sueldoRangeMin} onChange={(e) => setSueldoRangeMin(e.target.value)} required placeholder="Ej: 3000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sueldoRangeMax">Sueldo Máximo:</Label>
                            <Input id="sueldoRangeMax" type="number" value={sueldoRangeMax} onChange={(e) => setSueldoRangeMax(e.target.value)} required placeholder="Ej: 8000" />
                        </div>
                    </div>
                );
            case 'llegada_tarde':
                return (
                    <div className="space-y-2">
                        <Label htmlFor="tardanzaHora">Hora de Ingreso Permitida:</Label>
                        <Input id="tardanzaHora" type="time" step="1" value={tardanzaHora} onChange={(e) => setTardanzaHora(e.target.value)} required />
                    </div>
                );
            case 'salida_temprana':
                return (
                    <div className="space-y-2">
                        <Label htmlFor="tempranoHora">Hora de Salida (Mínima):</Label>
                        <Input id="tempranoHora" type="time" step="1" value={tempranoHora} onChange={(e) => setTempranoHora(e.target.value)} required />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderResults = () => {
        if (loading) return <p className="text-center py-4">Cargando resultados...</p>;
        if (results.length === 0) return <p className="text-center py-4 text-muted-foreground">No hay resultados para la consulta seleccionada.</p>;

        if (['cargo_especifico', 'sueldo_mayor', 'sueldo_rango'].includes(consultaType)) {
            return (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Users className="inline h-4 w-4 mr-1" /> Usuario</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead><Briefcase className="inline h-4 w-4 mr-1" /> Cargo</TableHead>
                            <TableHead className="text-right"><DollarSign className="inline h-4 w-4 mr-1" /> Sueldo (Bs)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.usuarios.nombre}</TableCell>
                                <TableCell>{item.usuarios.email}</TableCell>
                                <TableCell>{item.cargos.cargo}</TableCell>
                                <TableCell className="text-right">{item.cargos.sueldo}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }

        if (['llegada_tarde', 'salida_temprana'].includes(consultaType)) {
            return (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Users className="inline h-4 w-4 mr-1" /> Usuario</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead><CalendarDays className="inline h-4 w-4 mr-1" /> Fecha</TableHead>
                            <TableHead className="text-right"><Clock className="inline h-4 w-4 mr-1" /> Hora</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.usuarios.nombre}</TableCell>
                                <TableCell>{item.usuarios.email}</TableCell>
                                <TableCell>{item.fecha}</TableCell>
                                <TableCell className="text-right">{item.hora}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
        return null;
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <h1 className="text-4xl font-extrabold tracking-tight">
                <Search className="inline h-8 w-8 mr-2 text-blue-600" />
                Sistema de Consultas Avanzadas
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center space-x-2">
                        <ArrowRight className="h-5 w-5" />
                        Selección y Parámetros
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo de Consulta:</Label>
                        <Select value={consultaType} onValueChange={setConsultaType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione una consulta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cargo_especifico">1. Listar usuarios con Cargo Específico</SelectItem>
                                <SelectItem value="sueldo_mayor">2. Listar usuarios que ganan más de X Bs</SelectItem>
                                <SelectItem value="sueldo_rango">3. Listar usuarios que ganan entre X Bs y Y Bs</SelectItem>
                                <SelectItem value="llegada_tarde">4. Listar usuarios que llegaron tarde</SelectItem>
                                <SelectItem value="salida_temprana">5. Listar usuarios que se fueron temprano</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {renderInputFields()}

                    <Button onClick={executeQuery} className="w-full mt-4" disabled={loading}>
                        {loading ? 'Ejecutando...' : 'Ejecutar Consulta'}
                    </Button>
                </CardContent>
            </Card>

            <hr className="my-8" />

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Resultados</CardTitle>
                </CardHeader>
                <CardContent>
                    {renderResults()}
                </CardContent>
            </Card>
        </div>
    );
};

export default ConsultasPage;