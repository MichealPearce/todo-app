import { ModelUUID } from '@construct/server/database/Model'
import { Task } from '@construct/server/database/models/Task'
import { User } from '@construct/server/database/models/User'
import { ProjectData } from '@construct/shared'
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'

@Entity()
export class Project extends ModelUUID<ProjectData> implements ProjectData {
	@Column('varchar', { length: 255 })
	declare name: string

	@OneToMany(() => Task, task => task.project)
	declare tasks: Task[]

	@ManyToMany(() => User)
	@JoinTable({
		name: 'user_projects',
		joinColumn: { name: 'project_uuid', referencedColumnName: 'uuid' },
		inverseJoinColumn: { name: 'user_uuid', referencedColumnName: 'uuid' },
	})
	declare owners: User[]
}
