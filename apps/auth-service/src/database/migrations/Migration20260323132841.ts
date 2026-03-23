import { Migration } from '@mikro-orm/migrations';

export class Migration20260323132841 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "users" ("user_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "email" text null, "phone_number" text null, "password" text not null, "is_verified" boolean not null default false, "is_blocked" boolean not null default false, "is_deleted" boolean not null default false, primary key ("user_id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
    this.addSql(`alter table "users" add constraint "users_phone_number_unique" unique ("phone_number");`);
    this.addSql(`create index "users_email_phone_number_index" on "users" ("email", "phone_number");`);

    this.addSql(`create table "user_sessions" ("session_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "user_user_id" uuid not null, "refresh_token_hash" text not null, "family_id" uuid not null, "is_used" boolean not null default false, "device_id" text null, "ip_address" text null, "user_agent" text null, "expires_at" timestamptz not null, "is_revoked" boolean not null default false, primary key ("session_id"));`);
    this.addSql(`create index "user_sessions_refresh_token_hash_index" on "user_sessions" ("refresh_token_hash");`);
    this.addSql(`create index "user_sessions_family_id_index" on "user_sessions" ("family_id");`);

    this.addSql(`create table "user_otps" ("otp_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "user_user_id" uuid not null, "code" text not null, "type" text not null default 'verify_email', "status" text not null default 'pending', "expires_at" timestamptz not null, "metadata" jsonb null, primary key ("otp_id"));`);

    this.addSql(`alter table "user_sessions" add constraint "user_sessions_user_user_id_foreign" foreign key ("user_user_id") references "users" ("user_id") on delete cascade;`);

    this.addSql(`alter table "user_otps" add constraint "user_otps_user_user_id_foreign" foreign key ("user_user_id") references "users" ("user_id") on delete cascade;`);
    this.addSql(`alter table "user_otps" add constraint "user_otps_type_check" check ("type" in ('verify_email', 'reset_password', 'mfa'));`);
    this.addSql(`alter table "user_otps" add constraint "user_otps_status_check" check ("status" in ('pending', 'used', 'expired'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user_sessions" drop constraint "user_sessions_user_user_id_foreign";`);
    this.addSql(`alter table "user_otps" drop constraint "user_otps_user_user_id_foreign";`);

    this.addSql(`drop table if exists "users" cascade;`);
    this.addSql(`drop table if exists "user_sessions" cascade;`);
    this.addSql(`drop table if exists "user_otps" cascade;`);
  }

}
