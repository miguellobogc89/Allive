DO $$ BEGIN
  CREATE TYPE "NotificationType" AS ENUM ('LIVE_STARTED', 'NEW_FOLLOWER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "NotificationTargetType" AS ENUM ('LIVE', 'USER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "user_follows" (
  "id" TEXT NOT NULL,
  "follower_id" TEXT NOT NULL,
  "following_id" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "notification_device_tokens" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "expo_push_token" TEXT NOT NULL,
  "platform" TEXT,
  "device_id" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "notification_device_tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "notifications" (
  "id" TEXT NOT NULL,
  "recipient_id" TEXT NOT NULL,
  "actor_id" TEXT,
  "type" "NotificationType" NOT NULL,
  "text" TEXT NOT NULL,
  "action_label" TEXT,
  "target_type" "NotificationTargetType" NOT NULL,
  "target_id" TEXT NOT NULL,
  "dedupe_key" TEXT NOT NULL,
  "read_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_follows_unique" ON "user_follows"("follower_id", "following_id");
CREATE INDEX IF NOT EXISTS "user_follows_follower_idx" ON "user_follows"("follower_id");
CREATE INDEX IF NOT EXISTS "user_follows_following_idx" ON "user_follows"("following_id");

CREATE UNIQUE INDEX IF NOT EXISTS "notification_device_tokens_expo_push_token_key" ON "notification_device_tokens"("expo_push_token");
CREATE INDEX IF NOT EXISTS "notification_device_tokens_user_id_idx" ON "notification_device_tokens"("user_id");

CREATE UNIQUE INDEX IF NOT EXISTS "notifications_dedupe_key_key" ON "notifications"("dedupe_key");
CREATE INDEX IF NOT EXISTS "notifications_recipient_id_read_at_idx" ON "notifications"("recipient_id", "read_at");
CREATE INDEX IF NOT EXISTS "notifications_recipient_id_created_at_idx" ON "notifications"("recipient_id", "created_at");
CREATE INDEX IF NOT EXISTS "notifications_actor_id_idx" ON "notifications"("actor_id");

DO $$ BEGIN
  ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_fk" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_following_fk" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "notification_device_tokens" ADD CONSTRAINT "notification_device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
