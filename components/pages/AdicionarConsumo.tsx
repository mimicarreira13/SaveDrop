import { useState } from 'react';
import { motion } from 'motion/react';
import { Droplet, Plus, Minus, Save, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';

interface AdicionarConsumoProps {
    onSave: () => void;
    onCancel: () => void;
}

export function AdicionarConsumo({ onSave, onCancel }: AdicionarConsumoProps) {
    const [waterAmount, setWaterAmount] = useState(50);

    const handleIncrement = () => {
        setWaterAmount(prev => Math.min(prev + 10, 500));
    };

    const handleDecrement = () => {
        setWaterAmount(prev => Math.max(prev - 10, 0));
    };

    const handleSliderChange = (value: number[]) => {
        setWaterAmount(value[0]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setWaterAmount(Math.min(Math.max(value, 0), 500));
    };

    const handleSave = () => {
        // Aqui seria onde guardaria o consumo
        onSave();
    };

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-blue-600 mb-2">Adicionar Consumo</h1>
                <p className="text-gray-600">Registe o seu consumo de água</p>
            </motion.div>

            {/* Main Input Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="p-8 bg-gradient-to-br from-blue-500 to-green-500 text-white border-0 shadow-lg">
                    <div className="flex flex-col items-center space-y-6">
                        <Droplet className="w-20 h-20 opacity-80" />

                        {/* Display Value */}
                        <div className="text-center">
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-6xl">{waterAmount}</span>
                                <span className="text-2xl opacity-90">L</span>
                            </div>
                            <p className="text-sm opacity-90 mt-2">Litros consumidos</p>
                        </div>

                        {/* Increment/Decrement Buttons */}
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleDecrement}
                                className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white shadow-lg"
                                disabled={waterAmount <= 0}
                            >
                                <Minus className="w-6 h-6" />
                            </Button>

                            <div className="w-32 text-center">
                                <Input
                                    type="number"
                                    value={waterAmount}
                                    onChange={handleInputChange}
                                    className="text-center bg-white/20 border-2 border-white/40 text-white placeholder:text-white/60 h-12"
                                    min={0}
                                    max={500}
                                />
                            </div>

                            <Button
                                onClick={handleIncrement}
                                className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white shadow-lg"
                                disabled={waterAmount >= 500}
                            >
                                <Plus className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Slider for Quick Adjustment */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card className="p-6 bg-white border-blue-200">
                    <label className="block mb-4 text-gray-700">Ajuste rápido</label>
                    <Slider
                        value={[waterAmount]}
                        onValueChange={handleSliderChange}
                        max={500}
                        step={5}
                        className="w-full"
                    />
                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">0L</span>
                        <span className="text-xs text-gray-500">500L</span>
                    </div>
                </Card>
            </motion.div>

            {/* Mascot Message */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-3">
                        <Droplet className="w-8 h-8 text-blue-500 fill-blue-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-blue-800">
                                Obrigado por acompanhares o teu consumo!
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                                Cada registo ajuda-te a poupar mais água 💧
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                className="flex gap-4 pb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <Button
                    onClick={onCancel}
                    variant="outline"
                    className="flex-1 h-14 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                    <X className="w-5 h-5 mr-2" />
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    className="flex-1 h-14 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-lg"
                >
                    <Save className="w-5 h-5 mr-2" />
                    Guardar
                </Button>
            </motion.div>
        </div>
    );
}
