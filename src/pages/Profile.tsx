
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Shield, Bell, CreditCard, ChevronRight, Camera, KeyRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import BottomNavigation from '../components/BottomNavigation';
import { supabase } from '../lib/supabase';
import { getStoredPin, setStoredPin } from '../components/PinAuth';

const PERSONAL_ID = '7ae84675-26a8-4856-936a-b99bdb63ad3d';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Franco Blanco');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // PIN change state
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Cargar datos al iniciar
  React.useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('nombre, metadata')
        .eq('id', PERSONAL_ID)
        .maybeSingle();

      if (data) {
        setName(data.nombre || 'Franco Blanco');
        setEmail(data.metadata?.email || '');
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: PERSONAL_ID, 
        nombre: name,
        tipo: 'personal',
        metadata: { email, app: 'clarifi' }
      });

    setIsSaving(false);
    
    if (error) {
      toast.error("Error al guardar: " + error.message);
    } else {
      toast.success("Perfil actualizado correctamente");
    }
  };

  const handleChangePin = async () => {
    const storedPin = await getStoredPin();
    if (currentPin !== storedPin) {
      toast.error("El PIN actual es incorrecto");
      return;
    }
    if (newPin.length !== 8) {
      toast.error("El nuevo PIN debe tener 8 dígitos");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("Los PINs no coinciden");
      return;
    }
    await setStoredPin(newPin);
    toast.success("PIN actualizado correctamente");
    setShowPinModal(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] pb-32 font-sans">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#EEF2F7] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold text-[#0F172A]">Mi Perfil</h1>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-[#2563FF] text-white rounded-full px-6 font-bold shadow-lg shadow-blue-100"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-8 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-3xl bg-[#F1F5F9] border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563FF&color=fff&size=128`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-[#F1F5F9] flex items-center justify-center text-[#2563FF] transition-transform hover:scale-110">
              <Camera size={18} />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">{name}</h2>
          <p className="text-sm text-[#64748B] font-medium">{email}</p>
        </div>

        {/* Edit Form */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest px-2">Información Personal</h3>
          
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-white space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-[#64748B] uppercase tracking-wider ml-1">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-[#F1F5F9] bg-[#F8FAFC] focus:bg-white transition-all text-[#0F172A] font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-[#64748B] uppercase tracking-wider ml-1">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <Input 
                  id="email" 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-[#F1F5F9] bg-[#F8FAFC] focus:bg-white transition-all text-[#0F172A] font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest px-2">Seguridad</h3>
          
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-white">
            <button 
              onClick={() => setShowPinModal(true)}
              className="w-full p-6 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563FF] flex items-center justify-center">
                  <KeyRound size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#0F172A]">Cambiar PIN</p>
                  <p className="text-[10px] text-[#94A3B8] font-medium">Código de 8 dígitos para desbloquear</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#94A3B8]" />
            </button>

            <button className="w-full p-6 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563FF] flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#0F172A]">Privacidad</p>
                  <p className="text-[10px] text-[#94A3B8] font-medium">Biometría, Privacidad de datos</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#94A3B8]" />
            </button>

            <button className="w-full p-6 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#0F172A]">Notificaciones</p>
                  <p className="text-[10px] text-[#94A3B8] font-medium">Alertas de gasto, Reportes</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#94A3B8]" />
            </button>

            <button className="w-full p-6 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#0F172A]">Métodos de Pago</p>
                  <p className="text-[10px] text-[#94A3B8] font-medium">Visa • 1234, Master • 5678</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#94A3B8]" />
            </button>
          </div>
        </div>
      </main>

      {/* PIN Change Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0F172A]">Cambiar PIN</h2>
              <button 
                onClick={() => setShowPinModal(false)}
                className="w-10 h-10 rounded-2xl bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">PIN Actual</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="••••••••"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                  className="h-14 rounded-2xl text-center text-xl font-bold tracking-widest border-[#F1F5F9] bg-[#F8FAFC]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Nuevo PIN (8 dígitos)</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="••••••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="h-14 rounded-2xl text-center text-xl font-bold tracking-widest border-[#F1F5F9] bg-[#F8FAFC]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Confirmar Nuevo PIN</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="••••••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="h-14 rounded-2xl text-center text-xl font-bold tracking-widest border-[#F1F5F9] bg-[#F8FAFC]"
                />
              </div>
            </div>

            <Button
              onClick={handleChangePin}
              className="w-full h-14 bg-[#2563FF] text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100"
            >
              Actualizar PIN
            </Button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Profile;
