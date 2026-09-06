-- CreateEnum
CREATE TYPE "WaterType" AS ENUM ('FRESHWATER', 'SALTWATER', 'BOTH');

-- CreateEnum
CREATE TYPE "LifecycleStage" AS ENUM ('IDEA', 'SKETCH', 'CAD', 'SIMULATION', 'PROTOTYPE_MOLD', 'PROTOTYPE_INJECTION', 'TANK_TESTING', 'FIELD_TESTING', 'ENGINEERING_REVIEW', 'PILOT_PRODUCTION', 'PRODUCTION', 'CONTINUOUS_IMPROVEMENT', 'RETIRED');

-- CreateEnum
CREATE TYPE "BuoyancyClass" AS ENUM ('FLOATING', 'SLOW_SINK', 'NEUTRAL', 'FAST_SINK');

-- CreateEnum
CREATE TYPE "MoldStatus" AS ENUM ('DESIGN', 'IN_PRODUCTION', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('QUEUED', 'IN_PRODUCTION', 'QC_PENDING', 'PASSED', 'FAILED', 'PACKAGED', 'FINISHED');

-- CreateEnum
CREATE TYPE "InventoryCategory" AS ENUM ('RAW_PLASTISOL', 'PIGMENT', 'GLITTER', 'HOOK', 'BAG', 'LABEL', 'BOX', 'MOLD', 'PACKAGING', 'TOOL', 'FINISHED_GOOD', 'DAMAGED_GOOD', 'RETURN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CART', 'PENDING', 'PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "ProductFamily" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "positioning" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lure" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "shapeDna" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "generation" INTEGER NOT NULL DEFAULT 1,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "familyId" TEXT NOT NULL,
    "cadVersion" TEXT,
    "moldId" TEXT,
    "formulaId" TEXT,
    "lengthInches" DOUBLE PRECISION,
    "weightGrams" DOUBLE PRECISION,
    "density" DOUBLE PRECISION,
    "buoyancy" "BuoyancyClass" NOT NULL DEFAULT 'SLOW_SINK',
    "sinkRateInSec" DOUBLE PRECISION,
    "durability" INTEGER,
    "elasticity" INTEGER,
    "waterType" "WaterType" NOT NULL DEFAULT 'FRESHWATER',
    "targetSpecies" TEXT[],
    "waterClarity" TEXT[],
    "seasons" TEXT[],
    "depthRange" TEXT,
    "retrieveStyles" TEXT[],
    "hookRecommendation" TEXT,
    "riggingMethods" TEXT[],
    "recommendedLine" TEXT,
    "recommendedRod" TEXT,
    "stage" "LifecycleStage" NOT NULL DEFAULT 'PRODUCTION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionProfile" (
    "id" TEXT NOT NULL,
    "lureId" TEXT NOT NULL,
    "tailFrequencyHz" DOUBLE PRECISION,
    "kickAngleDeg" DOUBLE PRECISION,
    "bodyRoll" DOUBLE PRECISION,
    "flashIndex" DOUBLE PRECISION,
    "glideDistanceInches" DOUBLE PRECISION,
    "fallRateInPerSec" DOUBLE PRECISION,
    "flutterRate" DOUBLE PRECISION,
    "vibration" DOUBLE PRECISION,
    "dragCoefficient" DOUBLE PRECISION,
    "hydrodynamicStability" DOUBLE PRECISION,

    CONSTRAINT "ActionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mold" (
    "id" TEXT NOT NULL,
    "moldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "MoldStatus" NOT NULL DEFAULT 'DESIGN',
    "manufacturer" TEXT,
    "material" TEXT,
    "aluminumGrade" TEXT,
    "cavities" INTEGER NOT NULL DEFAULT 1,
    "cadFileUrl" TEXT,
    "stepFileUrl" TEXT,
    "stlFileUrl" TEXT,
    "camFileUrl" TEXT,
    "injectionTempC" DOUBLE PRECISION,
    "injectionPressure" DOUBLE PRECISION,
    "coolingTimeSec" DOUBLE PRECISION,
    "shotsProduced" INTEGER NOT NULL DEFAULT 0,
    "expectedLife" INTEGER,
    "currentLifePct" DOUBLE PRECISION,
    "avgCycleTimeSec" DOUBLE PRECISION,
    "replacementCost" DOUBLE PRECISION,
    "storageLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoldMaintenance" (
    "id" TEXT NOT NULL,
    "moldId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "cost" DOUBLE PRECISION,
    "performedBy" TEXT,

    CONSTRAINT "MoldMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlastisolFormula" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hardness" INTEGER,
    "softenerRatio" DOUBLE PRECISION,
    "saltPercent" DOUBLE PRECISION,
    "scent" TEXT,
    "uvAdditive" BOOLEAN NOT NULL DEFAULT false,
    "density" DOUBLE PRECISION,
    "stretchRating" INTEGER,
    "floatingRating" INTEGER,
    "shelfLifeDays" INTEGER,
    "injectionTempC" DOUBLE PRECISION,
    "coolingTimeSec" DOUBLE PRECISION,
    "costPerBait" DOUBLE PRECISION,
    "notes" TEXT,
    "revisions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlastisolFormula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "marketingName" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "hex" TEXT,
    "rgb" TEXT,
    "cmyk" TEXT,
    "pantone" TEXT,
    "pigmentFormula" TEXT,
    "pearlFormula" TEXT,
    "glitterBlend" TEXT,
    "uvAdditive" BOOLEAN NOT NULL DEFAULT false,
    "glowAdditive" BOOLEAN NOT NULL DEFAULT false,
    "clearWaterRating" INTEGER,
    "stainedWaterRating" INTEGER,
    "muddyWaterRating" INTEGER,
    "nightRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "lureId" TEXT NOT NULL,
    "colorId" TEXT,
    "countPerBag" INTEGER NOT NULL DEFAULT 8,
    "priceCents" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "subtotalCents" INTEGER NOT NULL DEFAULT 0,
    "shippingCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderLine" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "priceCents" INTEGER NOT NULL,

    CONSTRAINT "OrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "lureId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionBatch" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "moldId" TEXT NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'QUEUED',
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "rejectQuantity" INTEGER NOT NULL DEFAULT 0,
    "operator" TEXT,
    "injectionTempC" DOUBLE PRECISION,
    "cycleTimeSec" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityCheck" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "inspector" TEXT,
    "visualPass" BOOLEAN,
    "dimensionPass" BOOLEAN,
    "weightPass" BOOLEAN,
    "floatPass" BOOLEAN,
    "sinkPass" BOOLEAN,
    "hookAlignPass" BOOLEAN,
    "qualityScore" INTEGER,
    "photoUrls" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QualityCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "InventoryCategory" NOT NULL,
    "quantityOnHand" INTEGER NOT NULL DEFAULT 0,
    "reorderPoint" INTEGER NOT NULL DEFAULT 0,
    "unitCostCents" INTEGER,
    "location" TEXT,
    "variantId" TEXT,
    "supplierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "leadTimeDays" INTEGER,
    "moq" INTEGER,
    "qualityRating" INTEGER,
    "riskScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prototype" (
    "id" TEXT NOT NULL,
    "prototypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designer" TEXT,
    "stage" "LifecycleStage" NOT NULL DEFAULT 'SKETCH',
    "cadVersion" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "revisionNotes" TEXT,
    "patentNotes" TEXT,
    "lureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prototype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatchReport" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "lureId" TEXT,
    "species" TEXT,
    "lengthInches" DOUBLE PRECISION,
    "weightLbs" DOUBLE PRECISION,
    "waterTempF" DOUBLE PRECISION,
    "waterClarity" TEXT,
    "depthFt" DOUBLE PRECISION,
    "region" TEXT,
    "weather" TEXT,
    "season" TEXT,
    "colorCode" TEXT,
    "photoUrls" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatchReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldNote" (
    "id" TEXT NOT NULL,
    "lureId" TEXT,
    "prototypeId" TEXT,
    "author" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductFamily_code_key" ON "ProductFamily"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Lure_sku_key" ON "Lure"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Lure_shapeDna_key" ON "Lure"("shapeDna");

-- CreateIndex
CREATE INDEX "Lure_category_idx" ON "Lure"("category");

-- CreateIndex
CREATE INDEX "Lure_familyId_idx" ON "Lure"("familyId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionProfile_lureId_key" ON "ActionProfile"("lureId");

-- CreateIndex
CREATE UNIQUE INDEX "Mold_moldId_key" ON "Mold"("moldId");

-- CreateIndex
CREATE UNIQUE INDEX "PlastisolFormula_code_key" ON "PlastisolFormula"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Color_code_key" ON "Color"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_lureId_idx" ON "ProductVariant"("lureId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_number_key" ON "Order"("number");

-- CreateIndex
CREATE INDEX "Review_lureId_idx" ON "Review"("lureId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionBatch_batchId_key" ON "ProductionBatch"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_sku_key" ON "InventoryItem"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_variantId_key" ON "InventoryItem"("variantId");

-- CreateIndex
CREATE INDEX "InventoryItem_category_idx" ON "InventoryItem"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Prototype_prototypeId_key" ON "Prototype"("prototypeId");

-- CreateIndex
CREATE INDEX "CatchReport_species_idx" ON "CatchReport"("species");

-- CreateIndex
CREATE INDEX "CatchReport_lureId_idx" ON "CatchReport"("lureId");

-- AddForeignKey
ALTER TABLE "Lure" ADD CONSTRAINT "Lure_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "ProductFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lure" ADD CONSTRAINT "Lure_moldId_fkey" FOREIGN KEY ("moldId") REFERENCES "Mold"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lure" ADD CONSTRAINT "Lure_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "PlastisolFormula"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionProfile" ADD CONSTRAINT "ActionProfile_lureId_fkey" FOREIGN KEY ("lureId") REFERENCES "Lure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoldMaintenance" ADD CONSTRAINT "MoldMaintenance_moldId_fkey" FOREIGN KEY ("moldId") REFERENCES "Mold"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_lureId_fkey" FOREIGN KEY ("lureId") REFERENCES "Lure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_lureId_fkey" FOREIGN KEY ("lureId") REFERENCES "Lure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionBatch" ADD CONSTRAINT "ProductionBatch_moldId_fkey" FOREIGN KEY ("moldId") REFERENCES "Mold"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityCheck" ADD CONSTRAINT "QualityCheck_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductionBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prototype" ADD CONSTRAINT "Prototype_lureId_fkey" FOREIGN KEY ("lureId") REFERENCES "Lure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchReport" ADD CONSTRAINT "CatchReport_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchReport" ADD CONSTRAINT "CatchReport_lureId_fkey" FOREIGN KEY ("lureId") REFERENCES "Lure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldNote" ADD CONSTRAINT "FieldNote_lureId_fkey" FOREIGN KEY ("lureId") REFERENCES "Lure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldNote" ADD CONSTRAINT "FieldNote_prototypeId_fkey" FOREIGN KEY ("prototypeId") REFERENCES "Prototype"("id") ON DELETE SET NULL ON UPDATE CASCADE;

