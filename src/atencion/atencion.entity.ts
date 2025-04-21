import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Define la entidad que representa la tabla "t_tmpllamadas"
@Entity('t_tmpllamadas')
export class Atencion {
  
  @PrimaryGeneratedColumn()
  cod_ate: number; // ID de la atención

  @Column()
  cm_estado: string; // Estado de la atención

  @Column()
  fec_ate: Date; // Fecha de la atención

  @Column()
  nom_pac: string; // Nombre del paciente

  @Column()
  numero_ce: string; // Número del comprobante (CE)

  @Column('decimal')
  tar_ate: number; // Monto de la tarifa de atención

  @Column()
  for_ate: string; // Forma de pago

  @Column()
  num_operacion_ap: string; // Número de operación de pago

  @Column()
  cod_convenio: string; // Código del convenio si aplica

  @Column({ nullable: true })
  clasificacion_pac: number; // Clasificación del paciente, usado en filtros
}
