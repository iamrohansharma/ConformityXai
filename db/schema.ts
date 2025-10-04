import { pgTable, serial, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const assessments = pgTable('assessments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  organizationName: text('organization_name').notNull(),
  frameworkType: text('framework_type').notNull(),
  overallScore: integer('overall_score').default(0),
  assessmentData: jsonb('assessment_data').notNull(),
  status: text('status').notNull().default('in_progress'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const complianceFrameworks = pgTable('compliance_frameworks', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  description: text('description').notNull(),
  version: text('version').notNull(),
  requirements: jsonb('requirements').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const actionItems = pgTable('action_items', {
  id: serial('id').primaryKey(),
  assessmentId: integer('assessment_id').references(() => assessments.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  priority: text('priority').notNull(),
  status: text('status').notNull().default('open'),
  dueDate: timestamp('due_date'),
  frameworkType: text('framework_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type ComplianceFramework = typeof complianceFrameworks.$inferSelect;
export type ActionItem = typeof actionItems.$inferSelect;
