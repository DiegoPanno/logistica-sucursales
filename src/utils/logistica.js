export function obtenerReglaLogistica(textoDireccion) {
  const dir = textoDireccion.toLowerCase();

  // Mar del Plata y costa[cite: 4]
  if (dir.includes('mar del plata')) {
    return {
      zona: 'Mar del Plata (Urbano)',
      dias: 'Lunes a Sábados',
      corte: 'Límites: Hasta El Faro, Félix U. Camet, Est. Camet o Rotonda Mercado Central.',
      alerta: null
    };
  }
  if (dir.includes('sierras de los padres') || dir.includes('parque industrial')) {
    return {
      zona: 'Sierras / Parque Industrial',
      dias: 'Lunes y Miércoles',
      corte: 'Salidas programadas: Lun y Mié.',
      alerta: null
    };
  }
  if (dir.includes('batán') || dir.includes('batan')) {
    return {
      zona: 'Batán',
      dias: 'Lunes, Martes y Miércoles',
      corte: 'Salidas programadas: Lun, Mar y Mié.',
      alerta: null
    };
  }
  if (dir.includes('miramar')) {
    return {
      zona: 'Miramar',
      dias: 'Jueves',
      corte: 'Salida semanal fija: Jueves.',
      alerta: null
    };
  }
  if (dir.includes('santa clara')) {
    return {
      zona: 'Santa Clara del Mar',
      dias: 'Viernes',
      corte: 'Salida semanal fija: Viernes.',
      alerta: null
    };
  }

  // AMBA Zonas 1 y 2[cite: 3]
  const amba1y2 = [
    'san fernando', 'tigre', 'san isidro', 'vicente lópez', 'vicente lopez', 'escobar',
    'pilar', 'malvinas argentinas', 'josé c. paz', 'jose c paz', 'san miguel', 'moreno',
    'general rodríguez', 'general rodriguez', 'merlo', 'marcos paz', 'ituzaingó',
    'ituzaingo', 'hurlingham', 'morón', 'moron', 'tres de febrero', 'san martín', 'san martin'
  ];
  if (amba1y2.some((p) => dir.includes(p))) {
    return {
      zona: 'AMBA Zona 1 / 2',
      dias: 'Martes, Jueves y Sábados',
      corte: 'Tope de ingreso: 13:00 hs del día hábil anterior.',
      alerta: 'Pedidos con preparación tintométrica pasan al día hábil siguiente'
    };
  }

  // AMBA Zonas 3, 4 y 5[cite: 3]
  const amba345 = [
    'la matanza', 'lomas de zamora', 'lanús', 'lanus', 'ezeiza', 'esteban echeverría',
    'esteban echeverria', 'presidente perón', 'san vicente', 'quilmes', 'avellaneda',
    'berazategui', 'almirante brown', 'florencio varela', 'ensenada', 'berisso',
    'la plata', 'caba', 'ciudad autónoma de buenos aires', 'buenos aires'
  ];
  if (amba345.some((p) => dir.includes(p))) {
    return {
      zona: 'AMBA Zona 3 / 4 / 5 (CABA / Sur)',
      dias: 'Lunes, Miércoles y Viernes',
      corte: 'Tope de ingreso: 13:00 hs del día hábil anterior (Viernes 13 hs para Lunes).',
      alerta: 'Pedidos con preparación tintométrica pasan al día hábil siguiente'
    };
  }

  return {
    zona: 'Interior / Otra zona',
    dias: 'A coordinar',
    corte: 'Consultar logística de depósito o expreso.',
    alerta: null
  };
}