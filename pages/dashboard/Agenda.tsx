import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, X, Plus, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { Appointment } from '../../types';
import { supabase } from '../../services/supabaseClient';

export const Agenda: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Form State
  const [newClientName, setNewClientName] = useState('');
  const [newServiceType, setNewServiceType] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*');

      if (error) throw error;

      // Map snake_case to camelCase
      const formattedData: Appointment[] = (data || []).map((item: any) => ({
        id: item.id,
        date: item.date,
        time: item.time,
        clientName: item.client_name,
        serviceType: item.service_type
      }));

      setAppointments(formattedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Calendar Logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    // Sempre define dia 1 para evitar problemas de virada de mês (ex: 31 de Jan -> Fev)
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value);
    if (!isNaN(newYear) && newYear > 1900 && newYear < 2100) {
      setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
    }
  };

  const formatDateKey = (day: number) => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleDayClick = (day: number) => {
    setSelectedDateStr(formatDateKey(day));
    setSelectedTimeSlot(null);
    setNewClientName('');
    setNewServiceType('');
  };

  const closeModal = () => {
    setSelectedDateStr(null);
    setSelectedTimeSlot(null);
  };

  const handleAddAppointment = async () => {
    if (selectedDateStr && selectedTimeSlot && newClientName && newServiceType) {
      try {
        const newAppt = {
          date: selectedDateStr,
          time: selectedTimeSlot,
          client_name: newClientName,
          service_type: newServiceType
        };

        const { data, error } = await supabase
          .from('appointments')
          .insert([newAppt])
          .select()
          .single();

        if (error) throw error;

        // Map response back to frontend type
        const savedAppt: Appointment = {
          id: data.id,
          date: data.date,
          time: data.time,
          clientName: data.client_name,
          serviceType: data.service_type
        };

        setAppointments(prev => [...prev, savedAppt]);
        setNewClientName('');
        setNewServiceType('');
        setSelectedTimeSlot(null);
      } catch (error) {
        console.error('Error adding appointment:', error);
      }
    }
  };

  const handleCancelAppointment = async (e: React.MouseEvent, id: string) => {
    // Previne comportamento padrão e propagação
    e.preventDefault();
    e.stopPropagation();

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  // Generate Slots
  const businessHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const getAppointmentForSlot = (date: string, time: string) => {
    return appointments.find(a => a.date === date && a.time === time);
  };

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="text-yellow-500" size={32} />
          Agenda de Atendimentos
        </h1>

        {/* Controles de Data */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full text-slate-600 transition-colors">
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2 px-2">
            <select
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className="appearance-none bg-transparent font-bold text-lg text-slate-800 cursor-pointer outline-none hover:text-yellow-600 transition-colors text-right"
            >
              {monthNames.map((name, index) => (
                <option key={index} value={index}>{name}</option>
              ))}
            </select>

            <input
              type="number"
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="w-20 bg-transparent font-bold text-lg text-slate-800 outline-none hover:text-yellow-600 transition-colors border-none p-0 focus:ring-0"
            />
          </div>

          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full text-slate-600 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex-grow p-6 overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center font-bold text-gray-400 uppercase text-sm py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-5 flex-grow gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-50/50 rounded-lg"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = formatDateKey(day);
            const dayAppointments = appointments.filter(a => a.date === dateKey);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`
                  relative p-2 rounded-lg border transition-all flex flex-col items-start justify-start hover:shadow-md
                  ${isToday ? 'bg-yellow-50 border-yellow-300 ring-1 ring-yellow-300' : 'bg-white border-gray-100 hover:border-indigo-200'}
                `}
              >
                <span className={`text-lg font-semibold ${isToday ? 'text-yellow-700' : 'text-slate-700'}`}>{day}</span>

                <div className="mt-2 w-full space-y-1">
                  {dayAppointments.slice(0, 3).map(appt => (
                    <div key={appt.id} className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded truncate w-full text-left">
                      {appt.time} - {appt.clientName}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-[10px] text-gray-400 pl-1">
                      + {dayAppointments.length - 3} mais
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDateStr && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end backdrop-blur-sm">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedDateStr.split('-').reverse().join('/')}
                </h2>
                <p className="text-slate-500">Gerenciar Horários</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 flex-grow">
              {businessHours.map(time => {
                const appt = getAppointmentForSlot(selectedDateStr, time);
                const isSelected = selectedTimeSlot === time;

                return (
                  <div key={time} className={`border rounded-lg transition-all ${isSelected ? 'ring-2 ring-indigo-500 border-transparent' : 'border-gray-200'}`}>
                    {appt ? (
                      // Occupied Slot
                      <div className="p-4 bg-red-50 rounded-lg flex justify-between items-start group">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 font-bold text-red-800 mb-1">
                            <Clock size={16} /> {time} <span className="text-xs bg-red-200 px-2 py-0.5 rounded-full">Ocupado</span>
                          </div>
                          <p className="font-medium text-slate-800">{appt.clientName}</p>
                          <p className="text-xs text-slate-500">{appt.serviceType}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleCancelAppointment(e, appt.id)}
                          className="ml-2 bg-white text-red-600 border border-red-200 p-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all shadow-sm z-20 flex-shrink-0"
                          title="Cancelar Agendamento"
                        >
                          <Trash2 size={18} className="pointer-events-none" />
                        </button>
                      </div>
                    ) : (
                      // Free Slot
                      <div
                        onClick={() => !isSelected && setSelectedTimeSlot(time)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 rounded-lg ${isSelected ? 'bg-indigo-50' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 font-semibold text-slate-600">
                            <Clock size={16} /> {time}
                          </div>
                          <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full">Livre</span>
                        </div>

                        {isSelected && (
                          <div className="mt-4 pt-4 border-t border-indigo-100 animate-in fade-in zoom-in-95 duration-200">
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Nome do Cliente</label>
                                <div className="relative">
                                  <User className="absolute left-2 top-2.5 text-gray-400" size={14} />
                                  <input
                                    type="text"
                                    value={newClientName}
                                    onChange={e => setNewClientName(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 border rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Ex: João Silva"
                                    autoFocus
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo de Serviço</label>
                                <input
                                  type="text"
                                  value={newServiceType}
                                  onChange={e => setNewServiceType(e.target.value)}
                                  className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                  placeholder="Ex: Assinatura de Escritura"
                                />
                              </div>
                              <button
                                onClick={handleAddAppointment}
                                disabled={!newClientName || !newServiceType}
                                className="w-full bg-slate-900 text-white py-2 rounded font-semibold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                <Plus size={16} /> Confirmar Agendamento
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};