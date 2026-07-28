# Decisiones de Arquitectura

## ADR-001: Referencia en BD por string sentinel

**Contexto**: El formato de respuesta del v2 (`viewUrl` + `uuid`) no es compatible con el v1 (ruta relativa). Se necesita almacenar una referencia que permita regenerar view tokens cuando expiran.

**Decisión**: Guardar `exp2://{folderPath}#{uuid}` en las mismas columnas `text` existentes. El prefijo distingue v2 de legado sin migración SQL. Cero cambios de esquema sobre 9 tablas.

**Consecuencias**: No se puede hacer JOIN por referencia, pero no se necesita (el lookup es por ID de registro, no por referencia de archivo).

## ADR-002: Dual-read (v1 lee, v2 escribe)

**Contexto**: Archivos históricos están en v1. Migrar datos es riesgoso y no aporta beneficio inmediato.

**Decisión**: Todo upload nuevo va al v2. Referencias viejas en BD se siguen leyendo del v1 mientras el servidor esté vivo. Sin migración de datos, reversible.

**Consecuencias**: El proxy debe manejar ambos formatos. Complejidad acotada a un solo archivo. 
