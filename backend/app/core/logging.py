"""
Logging configuration for the application
"""

import sys
import logging
from typing import Any, Dict
import structlog
from .config import settings

def setup_logging():
    """Setup structured logging with structlog"""

    # Configure standard logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, settings.LOG_LEVEL.upper()),
    )

    # Configure structlog
    processors = [
        # Add logger name
        structlog.stdlib.add_logger_name,
        # Add log level
        structlog.stdlib.add_log_level,
        # Add timestamp
        structlog.stdlib.add_log_level,
        # Perform exception formatting
        structlog.processors.format_exc_info,
        # Add caller information
        structlog.processors.CallsiteParameterAdder(
            parameters=[structlog.processors.CallsiteParameter.FUNC_NAME]
        ),
        # Render as JSON in production, pretty format in development
        structlog.processors.JSONRenderer()
        if not settings.DEBUG
        else structlog.dev.ConsoleRenderer(colors=True),
    ]

    structlog.configure(
        processors=processors,
        wrapper_class=structlog.stdlib.BoundLogger,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    # Setup Sentry if DSN is provided
    if settings.SENTRY_DSN:
        try:
            import sentry_sdk
            from sentry_sdk.integrations.fastapi import FastApiIntegration
            from sentry_sdk.integrations.redis import RedisIntegration

            sentry_sdk.init(
                dsn=settings.SENTRY_DSN,
                integrations=[
                    FastApiIntegration(auto_enabling_integrations=False),
                    RedisIntegration(),
                ],
                traces_sample_rate=0.1,
                environment="production" if not settings.DEBUG else "development",
            )
            print("✅ Sentry initialized")

        except ImportError:
            print("⚠️ Sentry SDK not installed, skipping Sentry setup")
        except Exception as e:
            print(f"❌ Failed to initialize Sentry: {str(e)}")

class LoggerMixin:
    """Mixin class to add logging capabilities"""

    @property
    def logger(self):
        """Get logger instance for this class"""
        return structlog.get_logger(self.__class__.__name__)

def get_logger(name: str = None) -> structlog.BoundLogger:
    """Get a logger instance"""
    return structlog.get_logger(name)