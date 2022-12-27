import { ModelUUID } from '@construct/server/database/Model'
import { TaskData } from '@construct/shared'
import { Column, Entity } from 'typeorm'

@Entity()
export class Task extends ModelUUID<TaskData> implements TaskData {
	@Column('varchar', { length: 255 })
	declare title: string

	@Column('boolean')
	declare complete: boolean

	@Column('text', { nullable: true })
	declare body?: string
}
