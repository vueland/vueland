<template>
    <div class="pa-4 d-flex flex-col gap-3">
        <!-- Toolbar -->
        <c-card class="elevation-2 radius-12">
            <c-card-header class="bg-indigo px-4 py-3">
                <c-row
                    align="center"
                    no-gutter
                >
                    <span class="font-weight-bold text-white d-flex items-center gap-2">
                        <c-icon
                            name="fas:bolt"
                            source="fa"
                            :size="14"
                        />
                        Dashboard
                    </span>
                    <c-spacer />
                    <div class="d-flex items-center gap-3">
                        <span class="text-white nav-link">Docs</span>
                        <span class="text-white nav-link">Blog</span>
                        <c-btn
                            variant="outlined"
                            class="radius-pill text-white"
                        >
                            Sign In
                        </c-btn>
                    </div>
                </c-row>
            </c-card-header>
        </c-card>

        <!-- Article header -->
        <c-card class="elevation-2 radius-12">
            <c-card-header class="bg-deep-purple px-4 py-3">
                <c-row
                    align="center"
                    no-gutter
                >
                    <div class="avatar bg-white radius-circle d-flex items-center justify-center text-deep-purple font-weight-bold">
                        JD
                    </div>
                    <div class="ml-3">
                        <div
                            class="font-weight-bold text-white"
                            style="font-size:14px"
                        >
                            Jane Doe
                        </div>
                        <div
                            class="text-white"
                            style="font-size:12px;opacity:.6"
                        >
                            June 20, 2026
                        </div>
                    </div>
                    <c-spacer />
                    <div class="d-flex items-center gap-2">
                        <c-btn
                            variant="outlined"
                            class="radius-8 text-white"
                        >
                            <c-icon
                                name="fas:bookmark"
                                source="fa"
                                :size="14"
                            />
                        </c-btn>
                        <c-btn
                            variant="outlined"
                            class="radius-8 text-white"
                        >
                            <c-icon
                                name="fas:heart"
                                source="fa"
                                :size="14"
                            />
                        </c-btn>
                        <c-btn
                            variant="outlined"
                            class="radius-8 text-white"
                        >
                            <c-icon
                                name="fas:arrow-up-right-from-square"
                                source="fa"
                                :size="14"
                            />
                        </c-btn>
                    </div>
                </c-row>
            </c-card-header>
        </c-card>

        <!-- Pagination -->
        <c-card class="elevation-2 radius-12">
            <c-card-header class="bg-teal px-4 py-3">
                <c-row
                    align="center"
                    no-gutter
                >
                    <c-btn
                        variant="outlined"
                        class="radius-8 text-white"
                    >
                        <c-icon
                            name="fas:arrow-left"
                            source="fa"
                            :size="13"
                        />
                        Prev
                    </c-btn>
                    <c-spacer />
                    <span
                        class="text-white font-weight-bold"
                        style="font-size:13px"
                    >Page 3 of 12</span>
                    <c-spacer />
                    <c-btn
                        variant="outlined"
                        class="radius-8 text-white"
                    >
                        Next
                        <c-icon
                            name="fas:arrow-right"
                            source="fa"
                            :size="13"
                        />
                    </c-btn>
                </c-row>
            </c-card-header>
        </c-card>
    </div>
</template>

<style scoped>
.nav-link {
  font-size: 13px;
  cursor: pointer;
  opacity: .8;
  transition: opacity .15s;
}
.nav-link:hover { opacity: 1; }

.avatar {
  width: 40px;
  height: 40px;
  font-size: 13px;
  flex-shrink: 0;
}

.ml-3 { margin-left: 12px; }
</style>
