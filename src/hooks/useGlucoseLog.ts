import { useState, useCallback, useMemo } from 'react';
import { Glucometry, GlucometryType, MEAL_TIME_SLOTS } from '@/types/diabetes';
import { format, isSameDay, parseISO } from 'date-fns';

interface UseGlucoseLogReturn {
  records: Glucometry[];
  todayRecords: Map<GlucometryType, Glucometry>;
  addRecord: (type: GlucometryType, value: number, notes?: string) => void;
  updateRecord: (id: string, value: number, notes?: string) => void;
  getRecordsByDate: (date: Date) => Map<GlucometryType, Glucometry>;
  getSlotRecord: (type: GlucometryType, date?: Date) => Glucometry | undefined;
}

export function useGlucoseLog(initialRecords: Glucometry[] = []): UseGlucoseLogReturn {
  const [records, setRecords] = useState<Glucometry[]>(initialRecords);

  // Get records for a specific date grouped by type
  const getRecordsByDate = useCallback((date: Date): Map<GlucometryType, Glucometry> => {
    const dayRecords = new Map<GlucometryType, Glucometry>();
    
    records.forEach(record => {
      const recordDate = parseISO(record.timestamp);
      if (isSameDay(recordDate, date)) {
        // Only keep the latest record for each type
        const existing = dayRecords.get(record.type);
        if (!existing || parseISO(existing.timestamp) < recordDate) {
          dayRecords.set(record.type, record);
        }
      }
    });
    
    return dayRecords;
  }, [records]);

  // Get today's records
  const todayRecords = useMemo(() => {
    return getRecordsByDate(new Date());
  }, [getRecordsByDate]);

  // Get a specific slot record
  const getSlotRecord = useCallback((type: GlucometryType, date: Date = new Date()): Glucometry | undefined => {
    const dayRecords = getRecordsByDate(date);
    return dayRecords.get(type);
  }, [getRecordsByDate]);

  // Add a new record
  const addRecord = useCallback((type: GlucometryType, value: number, notes?: string) => {
    const newRecord: Glucometry = {
      id: `glucose-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value,
      type,
      timestamp: new Date().toISOString(),
      notes,
    };

    setRecords(prev => [...prev, newRecord]);
  }, []);

  // Update an existing record
  const updateRecord = useCallback((id: string, value: number, notes?: string) => {
    setRecords(prev => prev.map(record => 
      record.id === id 
        ? { ...record, value, notes, timestamp: new Date().toISOString() }
        : record
    ));
  }, []);

  return {
    records,
    todayRecords,
    addRecord,
    updateRecord,
    getRecordsByDate,
    getSlotRecord,
  };
}
