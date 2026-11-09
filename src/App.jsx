import React, { useState, useEffect } from 'react';
import { SUCURSALES } from './data/sucursales';
import { ordenarPorCercania } from './utils/geo';
import { obtenerReglaLogistica } from './utils/logistica';

export default function App() {
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [cargandoSugerencias, setCargandoSugerencias] = useState(false);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('');
  
  const [cercanas, setCercanas] = useState([]);
  const [logistica, setLogistica] = useState(null);

  // Buscar en OpenStreetMap con debounce
  useEffect(() => {
    const direccionCortaActual = direccionSeleccionada
      ? direccionSeleccionada.split(',').slice(0, 2).join(',').trim()
      : '';

    if (busqueda.trim().length < 4 || busqueda === direccionCortaActual) {
      setSugerencias([]);
      return;
    }

    const timer = setTimeout(async () => {
      setCargandoSugerencias(true);
      try {
        const query = encodeURIComponent(`${busqueda}, Argentina`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5&countrycodes=ar`
        );
        const data = await res.json();
        setSugerencias(data || []);
      } catch (err) {
        console.error("Error buscando en OpenStreetMap:", err);
      } finally {
        setCargandoSugerencias(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [busqueda, direccionSeleccionada]);

  // Selección de dirección sugerida
  const handleSeleccionarDireccion = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const textoCompleto = item.display_name;

    const partes = textoCompleto.split(',');
    const direccionCorta = partes.slice(0, 2).join(',').trim();

    setBusqueda(direccionCorta || textoCompleto);
    setDireccionSeleccionada(textoCompleto);
    setSugerencias([]);

    setLogistica(obtenerReglaLogistica(textoCompleto));

    const ranking = ordenarPorCercania(lat, lng, SUCURSALES, 5);
    setCercanas(ranking);
  };

  const limpiarBusqueda = () => {
    setBusqueda('');
    setDireccionSeleccionada('');
    setCercanas([]);
    setLogistica(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      
      {/* Header Institucional con Logo */}
     {/* Header Oficial Ámbito (Amarillo e-commerce + Magenta) */}
      <header style={{
        backgroundColor: '#ffd000',
        padding: '12px 24px',
        borderBottom: '4px solid #c4005d',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo y Nombre */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img 
              src="/LOGOS AMBITO-01.png" 
              alt="Pinturerías Ámbito" 
              style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
            />
            <div style={{ borderLeft: '2px solid rgba(0, 0, 0, 0.15)', paddingLeft: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.4px', textTransform: 'uppercase', color: '#111827' }}>
                Localizador & Logística
              </div>
              <div style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>
                Herramienta Interna de Atención y Despacho
              </div>
            </div>
          </div>

          {/* Botón / Badge Magenta estilo "Venta a Empresas" */}
          <span style={{
            fontSize: 11,
            background: '#c4005d',
            color: '#ffffff',
            padding: '7px 16px',
            borderRadius: 8,
            fontWeight: 800,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            boxShadow: '0 2px 4px rgba(196, 0, 93, 0.3)'
          }}>
            Ventas & Despachos
          </span>
        </div>
      </header>
      {/* Contenido Principal */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px' }}>
        
        {/* Tarjeta de Búsqueda de Domicilio */}
        <section style={{
          background: '#ffffff',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)',
          position: 'relative'
        }}>
          <label style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 800,
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 8
          }}>
            🔍 Domicilio del Cliente (Calle, Altura y Localidad)
          </label>
          
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Ej: Juncal 1350, Mar del Plata o Maipú 2500, Vicente López..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 44px 13px 14px',
                fontSize: 15,
                border: '2px solid #cbd5e1',
                borderRadius: 8,
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#e30068';
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.boxShadow = '0 0 0 3px rgba(227, 0, 104, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />

            {busqueda.length > 0 && (
              <button
                onClick={limpiarBusqueda}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#e2e8f0',
                  border: 'none',
                  borderRadius: '50%',
                  width: 26,
                  height: 26,
                  cursor: 'pointer',
                  color: '#475569',
                  fontWeight: 800,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          {cargandoSugerencias && (
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#e30068' }}></span>
              Localizando en el mapa...
            </div>
          )}

          {/* Menú de Sugerencias Flotante */}
          {sugerencias.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 24,
              right: 24,
              background: '#ffffff',
              border: '2px solid #0f172a',
              borderRadius: 8,
              boxShadow: '0 12px 24px -4px rgba(15, 23, 42, 0.25)',
              zIndex: 30,
              maxHeight: 250,
              overflowY: 'auto'
            }}>
              {sugerencias.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSeleccionarDireccion(item)}
                  style={{
                    padding: '12px 16px',
                    fontSize: 13,
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    color: '#1e293b',
                    lineHeight: '1.4',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fdf2f8';
                    e.currentTarget.style.color = '#be185d';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#1e293b';
                  }}
                >
                  <span style={{ fontSize: 16 }}>📍</span>
                  <span>{item.display_name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Banner de Información Logística */}
          {logistica && (
            <div style={{
              marginTop: 18,
              padding: '16px 18px',
              background: '#fff1f2',
              borderLeft: '5px solid #e30068',
              borderRadius: 8,
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#9f1239' }}>
                  🚚 Zona: {logistica.zona}
                </span>
                <span style={{
                  fontSize: 12,
                  fontWeight: 800,
                  background: '#e30068',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: 14
                }}>
                  DÍAS: {logistica.dias.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 13, marginTop: 6, color: '#881337', lineHeight: 1.4 }}>
                {logistica.corte}
              </div>
              {logistica.alerta && (
                <div style={{ fontSize: 12, fontStyle: 'italic', marginTop: 6, color: '#be123c', fontWeight: 600 }}>
                  ⚠️ {logistica.alerta}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Sección de Resultados */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Sucursales más cercanas {cercanas.length > 0 && `(${cercanas.length})`}
            </h2>
            {cercanas.length > 0 && (
              <span style={{ fontSize: 12, color: '#64748b' }}>Ordenadas por menor distancia</span>
            )}
          </div>

          {cercanas.length === 0 ? (
            <div style={{
              padding: 40,
              textAlign: 'center',
              background: '#ffffff',
              border: '2px dashed #cbd5e1',
              borderRadius: 12,
              color: '#64748b',
              fontSize: 14
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🏪</div>
              Ingresá una dirección arriba y seleccionala de la lista para ver las sucursales más convenientes.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {cercanas.map((suc, i) => {
                const esMasCercana = i === 0;
                return (
                  <div
                    key={suc.codigo}
                    style={{
                      background: '#ffffff',
                      border: esMasCercana ? '2px solid #e30068' : '1px solid #e2e8f0',
                      borderLeft: esMasCercana ? '6px solid #e30068' : '1px solid #e2e8f0',
                      borderRadius: 10,
                      padding: '16px 18px',
                      boxShadow: esMasCercana ? '0 6px 16px -2px rgba(227, 0, 104, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: 17, color: '#0f172a' }}>{suc.nombre}</strong>
                          <span style={{
                            fontSize: 11,
                            background: '#0f172a',
                            color: '#ffffff',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontWeight: 700
                          }}>
                            #{suc.codigo}
                          </span>
                          {esMasCercana && (
                            <span style={{
                              fontSize: 11,
                              background: '#e30068',
                              color: '#ffffff',
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontWeight: 800,
                              letterSpacing: '0.3px'
                            }}>
                              ★ MÁS CERCANA
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                          {suc.direccion} — <strong style={{ color: '#0f172a' }}>{suc.localidad}</strong>
                        </div>
                      </div>

                      {/* Distancia en km */}
                      <div style={{ textAlign: 'right', minWidth: 90 }}>
                        <div style={{
                          fontSize: 22,
                          fontWeight: 900,
                          color: esMasCercana ? '#e30068' : '#334155'
                        }}>
                          {suc.distanciaKm} <span style={{ fontSize: 13, fontWeight: 700 }}>km</span>
                        </div>
                      </div>
                    </div>

                    {/* Fila de Especificaciones Logísticas */}
                    <div style={{
                      marginTop: 12,
                      paddingTop: 10,
                      borderTop: '1px solid #f1f5f9',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                      gap: 12,
                      fontSize: 12,
                      color: '#475569'
                    }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>Prep. Faltas Depósito:</span>
                        <strong style={{ color: '#0f172a' }}>📦 {suc.diaPreparado}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>Corte para agregar a la Falta:</span>
                        <strong style={{ color: '#9f1239' }}>
                          ⏰ Hasta {suc.localidad === 'Mar del Plata' ? '17:00 hs' : '13:00 hs'} (día previo)
                        </strong>
                      </div>
                      {suc.tintometrica && suc.tintometrica !== 'Ambas' && (
                        <div>
                          <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>Máquina Tintométrica:</span>
                          <strong style={{ color: '#0f172a' }}>🎨 {suc.tintometrica}</strong>
                        </div>
                      )}
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>Horario L a V:</span>
                        <span style={{ color: '#0f172a', fontWeight: 600 }}>🕒 {suc.horarioLV}</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: 11 }}>Teléfono:</span>
                        <span style={{ color: '#0f172a', fontWeight: 600 }}>📞 {suc.telefono}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}