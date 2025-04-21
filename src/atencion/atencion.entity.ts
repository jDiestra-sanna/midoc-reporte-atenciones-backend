import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_tmpllamadas')
export class Atencion {
  @PrimaryGeneratedColumn()
  cod_ate: number;

  @Column()
  cm_estado: string;

  @Column()
  fec_ate: Date;

  @Column()
  nom_pac: string;

  @Column()
  numero_ce: string;

  @Column('decimal')
  tar_ate: number;

  @Column()
  for_ate: string;

  @Column()
  num_operacion_ap: string;

  @Column()
  cod_convenio: string;

  @Column({ nullable: true })
  clasificacion_pac: number; // importante: agregarlo porque lo usas en WHERE
}
