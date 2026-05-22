package com.nullbase.personalAssist.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;

public class DotenvConfig
    implements ApplicationContextInitializer<ConfigurableApplicationContext> {

  @Override
  public void initialize(ConfigurableApplicationContext applicationContext) {

    Dotenv dotenv = Dotenv.configure()
        .directory("./")
        .ignoreIfMalformed()
        .ignoreIfMissing()
        .load();

    dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
  }
}