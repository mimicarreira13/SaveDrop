import {
    Droplet, Bath, Hand, Sparkles, Scissors, Utensils, Coffee,
    Shirt, RotateCw, Circle, Leaf, Car, Clock, Hash,
    Save, X, ChevronDown, ChevronUp, Check, AlertCircle
} from 'lucide-react';

// Mapeamento de ícones
const iconMap: { [key: string]: React.ElementType } = {
    Droplet,
    Bath,
    Hand,
    Sparkles,
    Scissors,
    Utensils,
    Coffee,
    Shirt,
    RotateCw,
    Circle,
    Leaf,
    Car,
    Clock,
    Hash,
    Save,
    X,
    ChevronDown,
    ChevronUp,
    Check,
    AlertCircle
};

export const getIcon = (iconName: string): React.ElementType => {
    return iconMap[iconName] || Droplet;
};