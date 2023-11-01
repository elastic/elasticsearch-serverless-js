ARG NODE_VERSION=${NODE_VERSION:-18}
FROM node:$NODE_VERSION

ARG BUILDER_USER=1000
ARG BUILDER_GROUP=1000

# Install zip util
RUN apt-get clean -y && \
    apt-get update -y && \
    apt-get install -y zip

# Set up all files as owned by current user rather than root
RUN groupadd -f --system -g ${BUILDER_GROUP} elastic \
    && (id -u ${BUILDER_USER} &>/dev/null || useradd --system --shell /bin/bash -u ${BUILDER_USER} -g ${BUILDER_GROUP} -m elastic 1>/dev/null 2>/dev/null) \
    && mkdir -p /usr/src/app \
    && chown -R ${BUILDER_USER}:${BUILDER_GROUP} /usr/src/
WORKDIR /usr/src/app
USER ${BUILDER_USER}:${BUILDER_GROUP}

COPY --chown=${BUILDER_USER}:${BUILDER_GROUP} package.json .
RUN npm install

COPY --chown=${BUILDER_USER}:${BUILDER_GROUP} . .
