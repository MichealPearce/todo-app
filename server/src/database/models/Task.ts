import { ModelUUID } from '@construct/server/database/Model'
import { Project } from '@construct/server/database/models/Project'
import { TaskData } from '@construct/shared'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

@Entity()
export class Task extends ModelUUID<TaskData> implements TaskData {
	@Column('varchar', { length: 255 })
	declare title: string

	@Column('boolean')
	declare complete: boolean

	@Column('text', { nullable: true })
	declare body?: string

	@Column()
	declare project_uuid: string

	@ManyToOne(() => Project, project => project.tasks)
	@JoinColumn({ name: 'project_uuid' })
	declare project: Project
}
